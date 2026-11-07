import MenuItem from '../models/MenuItem.js';

/**
 * @desc    Fetch all menu items with search, filter, sort, and pagination
 * @route   GET /api/menu
 * @access  Public
 */
export const getMenuItems = async (req, res, next) => {
  try {
    const {
      search,
      name,
      category,
      isAvailable,
      sort,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // 1. Search by name or description
    const searchTerm = search || name;
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm.trim(), $options: 'i' } },
        { description: { $regex: searchTerm.trim(), $options: 'i' } },
      ];
    }

    // 2. Filter by Category
    if (category) {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // 3. Filter by Availability
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    // 4. Sorting logic
    let sortOptions = { createdAt: -1 }; // Default: newest first

    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'name_asc':
          sortOptions = { name: 1 };
          break;
        case 'name_desc':
          sortOptions = { name: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
      }
    } else if (sortBy) {
      const sortDirection = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortDirection };
    }

    // 5. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalItems = await MenuItem.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    const items = await MenuItem.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      count: items.length,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fetch a single menu item by ID
 * @route   GET /api/menu/:id
 * @access  Public
 */
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu
 * @access  Public / Admin
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable, preparationTime } = req.body;

    // Check for duplicate name (case-insensitive)
    const existingItem = await MenuItem.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: `Menu item '${name.trim()}' already exists`,
      });
    }

    const newItem = await MenuItem.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: parseFloat(price),
      category: category.trim().toLowerCase(),
      image: image ? image.trim() : '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      preparationTime: preparationTime !== undefined ? parseInt(preparationTime, 10) : 10,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing menu item by ID
 * @route   PUT /api/menu/:id
 * @access  Public / Admin
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found`,
      });
    }

    const { name, description, price, category, image, isAvailable, preparationTime } = req.body;

    // Check for duplicate name if name is being changed
    if (name && name.trim().toLowerCase() !== item.name.toLowerCase()) {
      const duplicate = await MenuItem.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Another menu item named '${name.trim()}' already exists`,
        });
      }
      item.name = name.trim();
    }

    if (description !== undefined) item.description = description.trim();
    if (price !== undefined) item.price = parseFloat(price);
    if (category !== undefined) item.category = category.trim().toLowerCase();
    if (image !== undefined) item.image = image.trim();
    if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);
    if (preparationTime !== undefined) item.preparationTime = parseInt(preparationTime, 10);

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a menu item by ID
 * @route   DELETE /api/menu/:id
 * @access  Public / Admin
 */
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${req.params.id} not found`,
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Menu item '${item.name}' deleted successfully`,
      data: {
        id: req.params.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

