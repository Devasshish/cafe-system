import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number or identifier is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [30, 'Table identifier cannot exceed 30 characters'],
    },
    capacity: {
      type: Number,
      default: 4,
      min: [1, 'Capacity must be at least 1'],
    },
    section: {
      type: String,
      trim: true,
      default: 'Main Hall',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

tableSchema.index({ tableNumber: 1 });

const Table = mongoose.model('Table', tableSchema);

export default Table;

