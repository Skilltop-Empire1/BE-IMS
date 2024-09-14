const { Category, Store, Product } = require('../models');
const {Sequelize,Op} = require("sequelize")
const {createCategorySchema,updateCategorySchema} = require("../validations/categoryValidation")
// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { storeId, name } = req.body;
    //category validation
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const categoryExist = await Category.findOne({
      where: { name,storeId },
    });

    if (categoryExist) {
      return res.status(409).json({ message: "Category already exists" });
    }
    //create ctegory
    const category = await Category.create({ storeId, name });
    return res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



// Get all categories with product counts
exports.getAllCategories = async (req, res) => {
  try {
    // Find all categories with product counts
    const categories = await Category.findAll({
      attributes: {
        include: [
          // Include product count
          [Sequelize.fn('COUNT', Sequelize.col('Products.prodId')), 'productCount']
        ]
      },
      include: [
        {
          model: Product,
          attributes: []  // Don't include product details, just count
        },
        {
          model: Store,
          attributes: ['storeId', 'storeName']
        }
      ],
      group: ['Category.catId', 'Store.storeId']  // Group by category and store
    });

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Get a category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { catId } = req.params;
    const category = await Category.findByPk(catId, {
      include: [{ model: Store }, { model: Product }]
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const { storeId, name } = req.body;
    const category = await Category.findByPk(catId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    //category validation
    const { error } = updateCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    //update category
    category.storeId = storeId || category.storeId;
    category.name = name || category.name;
    await category.save();
    return res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const category = await Category.findByPk(catId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await category.destroy();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get categories by store
exports.getCategoriesByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const categories = await Category.findAll({
      where: { storeId },
      include: [{ model: Product }]
    });
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get products in a category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const category = await Category.findByPk(catId, {
      include: [{ model: Product }]
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    return res.status(200).json({ products: category.Products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
