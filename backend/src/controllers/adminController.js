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

