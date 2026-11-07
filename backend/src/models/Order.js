import mongoose from 'mongoose';

/**
 * Order Item Sub-schema
 * Stores snapshots of the item's name and price at the exact moment of order creation.
 * This guarantees historical data integrity even if MenuItem is modified or deleted later.
 */
const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: [true, 'MenuItem reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Item name snapshot is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Item price snapshot is required'],
      min: [0.01, 'Price snapshot must be a positive number'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Customer name must be at least 2 characters'],
      maxlength: [60, 'Customer name cannot exceed 60 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[0-9\s-]{7,15}$/, 'Please provide a valid phone number'],
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items are required'],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'An order must contain at least one item',
      },
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Unpaid', 'Paid', 'Failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'Unpaid',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query performance (e.g. admin dashboard queries, filtering by status and date)
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ tableNumber: 1, orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;

