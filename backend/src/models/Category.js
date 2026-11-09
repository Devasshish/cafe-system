import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category slug/name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    label: {
      type: String,
      required: [true, 'Display label is required'],
      trim: true,
      minlength: [2, 'Display label must be at least 2 characters'],
      maxlength: [60, 'Display label cannot exceed 60 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
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

categorySchema.index({ order: 1, name: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;

