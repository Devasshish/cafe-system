import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

/**
 * Helper to generate a collision-resistant unique order number
 * Format: ORD-YYMMDD-XXXX (e.g. ORD-261108-4821)
 */
const generateUniqueOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  let isUnique = false;
  let orderNumber = '';

  while (!isUnique) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    orderNumber = `ORD-${dateStr}-${randomSuffix}`;
    const existing = await Order.findOne({ orderNumber }).lean();
    if (!existing) {
      isUnique = true;
    }
  }

  return orderNumber;
};

/**
 * @desc    Place a new customer order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, phoneNumber, tableNumber, items } = req.body;

    // 1. Gather all unique requested MenuItem IDs
    const requestedItemIds = [...new Set(items.map((item) => item.menuItem.toString()))];

    // 2. Fetch all referenced MenuItems from DB in a single query
    const dbMenuItems = await MenuItem.find({ _id: { $in: requestedItemIds } });
    const itemMap = new Map(dbMenuItems.map((item) => [item._id.toString(), item]));

    // 3. Verify every requested item exists
    for (const item of items) {
      const idStr = item.menuItem.toString();
      if (!itemMap.has(idStr)) {
        return res.status(400).json({
          success: false,
          message: `Menu item with ID '${idStr}' does not exist`,
        });
      }
    }

    // 4. Verify availability of every requested item
    const unavailableItems = [];
    for (const item of items) {
      const dbItem = itemMap.get(item.menuItem.toString());
      if (!dbItem.isAvailable) {
        unavailableItems.push(dbItem.name);
      }
    }

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `The following item(s) are currently unavailable: ${unavailableItems.join(', ')}`,
        unavailableItems,
      });
    }

    // 5. Construct order items with guaranteed backend price & name snapshots
    let calculatedSubtotal = 0;
    const orderItemsSnapshots = [];

    for (const item of items) {
      const dbItem = itemMap.get(item.menuItem.toString());
      const quantity = parseInt(item.quantity, 10);
      const lineTotal = Math.round(dbItem.price * quantity * 100) / 100;

      calculatedSubtotal += lineTotal;

      orderItemsSnapshots.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price, // NEVER trust frontend prices
        quantity,
      });
    }

    calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;
    const calculatedTotal = calculatedSubtotal; // Extensible for taxes/discounts

    // 6. Generate unique order number
    const orderNumber = await generateUniqueOrderNumber();

    // 7. Save order in MongoDB
    const order = await Order.create({
      orderNumber,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      tableNumber: String(tableNumber).trim(),
      items: orderItemsSnapshots,
      subtotal: calculatedSubtotal,
      totalAmount: calculatedTotal,
      orderStatus: 'Pending',
      paymentStatus: 'Unpaid',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders with pagination, status filtering, and search
 * @route   GET /api/orders
 * @access  Public / Admin
 */
export const getOrders = async (req, res, next) => {
  try {
    const {
      status,
      orderStatus,
      paymentStatus,
      tableNumber,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 1. Status Filter
    const activeStatus = status || orderStatus;
    if (activeStatus) {
      query.orderStatus = activeStatus;
    }

    // 2. Payment Status Filter
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // 3. Table Number Filter
    if (tableNumber) {
      query.tableNumber = String(tableNumber).trim();
    }

    // 4. Search Filter (by orderNumber, customerName, or phoneNumber)
    if (search) {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ orderNumber: regex }, { customerName: regex }, { phoneNumber: regex }];
    }

    // 5. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.menuItem', 'category image preparationTime')
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Public / Admin
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'category image preparationTime')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${req.params.id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Admin
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${req.params.id}' not found`,
      });
    }

    order.orderStatus = orderStatus;

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${orderStatus}' successfully`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

