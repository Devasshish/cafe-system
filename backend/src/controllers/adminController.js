import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

/**
 * @desc    Authenticate admin and return JWT token
 * @route   POST /api/admin/login
 * @access  Public
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    if (username.trim() !== envUsername || password !== envPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin username or password',
      });
    }

    const token = jwt.sign(
      { username: envUsername, role: 'admin' },
      process.env.JWT_SECRET || 'cafe_jwt_secret_dev_key_2026',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful',
      token,
      admin: {
        username: envUsername,
        role: 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & overview statistics
 * @route   GET /api/admin/stats
 * @access  Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
      totalMenuItems,
      availableMenuItems,
      recentOrders,
      salesAggregation,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Preparing' }),
      Order.countDocuments({ orderStatus: 'Ready' }),
      Order.countDocuments({ orderStatus: 'Completed' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      MenuItem.countDocuments(),
      MenuItem.countDocuments({ isAvailable: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalSales = salesAggregation[0]?.total
      ? Math.round(salesAggregation[0].total * 100) / 100
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        cancelledOrders,
        totalSales,
        totalMenuItems,
        availableMenuItems,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated customers list with order counts & details
 * @route   GET /api/admin/customers
 * @access  Admin
 */
export const getAdminCustomers = async (req, res, next) => {
  try {
    const { search, sortBy = 'orders' } = req.query;

    const pipeline = [
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $trim: {
              input: {
                $replaceAll: {
                  input: { $ifNull: ['$phoneNumber', ''] },
                  find: ' ',
                  replacement: '',
                },
              },
            },
          },
          customerName: { $first: '$customerName' },
          phoneNumber: { $first: '$phoneNumber' },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Completed'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] },
          },
          totalSpent: {
            $sum: {
              $cond: [{ $ne: ['$orderStatus', 'Cancelled'] }, '$totalAmount', 0],
            },
          },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
          tables: { $addToSet: '$tableNumber' },
          recentOrders: {
            $push: {
              _id: '$_id',
              orderNumber: '$orderNumber',
              totalAmount: '$totalAmount',
              orderStatus: '$orderStatus',
              createdAt: '$createdAt',
              tableNumber: '$tableNumber',
              itemsCount: { $size: { $ifNull: ['$items', []] } },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          customerKey: '$_id',
          customerName: 1,
          phoneNumber: { $ifNull: ['$phoneNumber', '$_id'] },
          totalOrders: 1,
          completedOrders: 1,
          cancelledOrders: 1,
          totalSpent: { $round: ['$totalSpent', 2] },
          lastOrderDate: 1,
          firstOrderDate: 1,
          tables: 1,
          recentOrders: { $slice: ['$recentOrders', 10] },
        },
      },
    ];

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      pipeline.push({
        $match: {
          $or: [{ customerName: regex }, { phoneNumber: regex }],
        },
      });
    }

    let sortStage = { totalOrders: -1, lastOrderDate: -1 };
    if (sortBy === 'spent') {
      sortStage = { totalSpent: -1, totalOrders: -1 };
    } else if (sortBy === 'recent') {
      sortStage = { lastOrderDate: -1 };
    } else if (sortBy === 'name') {
      sortStage = { customerName: 1 };
    }

    pipeline.push({ $sort: sortStage });

    const customers = await Order.aggregate(pipeline);

    // Summary calculations
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);

    res.status(200).json({
      success: true,
      count: customers.length,
      summary: {
        totalCustomers,
        repeatCustomers,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      },
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};


