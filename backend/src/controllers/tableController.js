import Table from '../models/Table.js';

/**
 * @desc    Get all cafe tables
 * @route   GET /api/tables
 * @access  Public / Admin
 */
export const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find({ isActive: true }).sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new table (Admin)
 * @route   POST /api/tables
 * @access  Public / Admin
 */
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity, section } = req.body;

    if (!tableNumber || !tableNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Table number or identifier is required (e.g. T01, Bar-1, Patio-2)',
      });
    }

    const cleanTableNum = tableNumber.trim().toUpperCase();

    // Check if table already exists
    const existing = await Table.findOne({ tableNumber: cleanTableNum });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Table '${cleanTableNum}' already exists.`,
      });
    }

    const newTable = await Table.create({
      tableNumber: cleanTableNum,
      capacity: capacity ? Number(capacity) : 4,
      section: section ? section.trim() : 'Main Hall',
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: `Table ${cleanTableNum} added successfully.`,
      data: newTable,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a table by ID
 * @route   DELETE /api/tables/:id
 * @access  Public / Admin
 */
export const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    await Table.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Table ${table.tableNumber} removed successfully.`,
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

