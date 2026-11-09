import Category from '../models/Category.js';
import MenuItem from '../models/MenuItem.js';

// Default starter categories
const DEFAULT_CATEGORIES = [
  { name: 'cappuccino', label: 'Cappuccino', order: 1 },
  { name: 'latte', label: 'Latte', order: 2 },
  { name: 'mocha', label: 'Mocha', order: 3 },
  { name: 'frappuccino', label: 'Frappuccino', order: 4 },
  { name: 'cold coffee', label: 'Cold Coffee', order: 5 },
  { name: 'hot coffee', label: 'Hot Coffee', order: 6 },
  { name: 'flat white', label: 'Flat White', order: 7 },
  { name: 'bakery', label: 'Bakery & Bites', order: 8 },
  { name: 'desserts', label: 'Desserts', order: 9 },
  { name: 'beverages', label: 'Artisan Beverages', order: 10 },
];

/**
 * Helper to ensure default categories exist or seed from existing MenuItems
 */
const ensureInitialCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    // Find distinct categories in existing menu items
    const existingCats = await MenuItem.distinct('category');
    const toInsert = [];

    DEFAULT_CATEGORIES.forEach((def, index) => {
      toInsert.push({ ...def, order: index + 1 });
    });

    // Also include any categories found in MenuItems that are not in defaults
    existingCats.forEach((cat) => {
      if (cat && !toInsert.some((c) => c.name === cat.toLowerCase())) {
        toInsert.push({
          name: cat.toLowerCase(),
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          order: toInsert.length + 1,
        });
      }
    });

    await Category.insertMany(toInsert);
    console.log(`[Categories] Seeded ${toInsert.length} initial categories.`);
  }
};

/**
 * @desc    Get all categories with associated menu item counts
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    await ensureInitialCategories();

    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({ order: 1, name: 1 }).lean();

    // Aggregate menu item count per category
    const itemCounts = await MenuItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          availableCount: {
            $sum: { $cond: ['$isAvailable', 1, 0] },
          },
        },
      },
    ]);

    const countMap = {};
    itemCounts.forEach((ic) => {
      if (ic._id) {
        countMap[ic._id.toLowerCase()] = {
          total: ic.count,
          available: ic.availableCount,
        };
      }
    });

    const enriched = categories.map((cat) => ({
      ...cat,
      totalItems: countMap[cat.name]?.total || 0,
      availableItems: countMap[cat.name]?.available || 0,
    }));

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, label, description, order, isActive } = req.body;

    if (!label || !label.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category display label is required',
      });
    }

    const cleanLabel = label.trim();
    const cleanName = (name || cleanLabel).trim().toLowerCase();

    // Check duplicate
    const existing = await Category.findOne({ name: cleanName });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category with name "${cleanName}" already exists`,
      });
    }

    // Determine default order
    let finalOrder = order !== undefined ? Number(order) : 0;
    if (finalOrder === 0) {
      const highest = await Category.findOne().sort({ order: -1 });
      finalOrder = highest ? highest.order + 1 : 1;
    }

    const newCategory = await Category.create({
      name: cleanName,
      label: cleanLabel,
      description: (description || '').trim(),
      order: finalOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, label, description, order, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const oldName = category.name;

    if (label && label.trim()) {
      category.label = label.trim();
    }

    if (name && name.trim()) {
      const cleanName = name.trim().toLowerCase();
      if (cleanName !== oldName) {
        const existing = await Category.findOne({ name: cleanName, _id: { $ne: id } });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `Category name "${cleanName}" already exists`,
          });
        }
        category.name = cleanName;

        // Cascade update in MenuItems if category slug changed
        await MenuItem.updateMany({ category: oldName }, { category: cleanName });
      }
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (order !== undefined) {
      category.order = Number(order);
    }

    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle category active status
 * @route   PATCH /api/categories/:id/toggle
 * @access  Private (Admin)
 */
export const toggleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      success: true,
      message: `Category is now ${category.isActive ? 'active' : 'inactive'}`,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if there are active menu items using this category
    const itemsCount = await MenuItem.countDocuments({ category: category.name });
    if (itemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.label}". It currently contains ${itemsCount} menu item(s). Reassign or delete those items first, or deactivate this category instead.`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Category "${category.label}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

