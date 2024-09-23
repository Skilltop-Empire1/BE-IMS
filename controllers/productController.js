const { Product } = require('../models'); // Import the Product model
const { Op } = require('sequelize');
const path = require("path")
const cloudinary = require("../config/cloudinary")
const {createProductSchema, updateProductSchema,updateStockSchema} = require("../validations/productValidation")

// Create a new product
exports.createProduct = async (req, res) => {
  try {
  
    const { name, price, itemCode,  alertStatus, quantity, categoryId, storeId,storeAvailable, prodDate } = req.body;
    //const prodPhoto = req.file? req.file.path: null
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "image",
      width: 300,
      crop: "scale"
    });
  
    // Extract URL and public_id from result
    const { url, public_id } = result;
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Check if product already exists by name and categoryId
    const productExist = await Product.findOne({
      where: { name,categoryId },
    });

    if (productExist) {
      return res.status(409).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      price,
      itemCode,
      prodPhoto:url,
      alertStatus,
      quantity,
      categoryId,
      storeId,
      storeAvailable,
      prodDate
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    console.log("userId",req.user)
    const products = await Product.findAll({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const {prodId} = req.params
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { prodId } = req.params; 
    const { name, price, itemCode, alertStatus, quantity, categoryId, storeId, storeAvailable, prodDate } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "image",
        width: 300,
        crop: "scale",
      });
      //Extract product url
      const {url} = result;
  
    const { error } = updateProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update({
      name:name || product.name,
      price:price || product.price,
      itemCode:itemCode || product.itemCode,
      prodPhoto: url || product.prodPhoto, 
      alertStatus:alertStatus || product.alertStatus,
      quantity:quantity || product.quantity,
      categoryId:categoryId || product.categoryId,
      storeId:storeId || product.storeId,
      storeAvailable:storeAvailable || product.storeAvailable,
      prodDate:prodDate || product.prodDate,
    });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { categoryId: req.params.categoryId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get products by store
exports.getProductsByStore = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { storeId: req.params.storeId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.prodId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // request body validation
    const { error } = updateStockSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    //updating product stock
    product.quantity = req.body.quantity;
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Filter products by availability
exports.getProductsByAvailability = async (req, res) => {
  try {
    const { availability } = req.query; // 'storeA', 'storeB', 'storeC'
    const products = await Product.findAll({
      where: {
        storeAvailable: availability
      }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.filterAllProducts = async (req, res) => {
  try {
    // Extract query parameters
    const {
      name,
      categoryId,
      storeId,
      alertStatus,
      priceMin,
      priceMax,
      sort,
      limit,
      page
    } = req.query;

    // Create a filter object based on the query params
    const where = {};

    // Filter by product name (case-insensitive search)
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    // Ensure categoryId is an integer and filter by categoryId
    if (categoryId && !isNaN(parseInt(categoryId))) {
      where.categoryId = parseInt(categoryId);
    } else if (categoryId) {
      return res.status(400).json({ error: 'Invalid categoryId format' });
    }

    // Ensure storeId is an integer and filter by storeId
    if (storeId && !isNaN(parseInt(storeId))) {
      where.storeId = parseInt(storeId);
    } else if (storeId) {
      return res.status(400).json({ error: 'Invalid storeId format' });
    }

    // Filter by alertStatus (active, low, sold out)
    if (alertStatus) {
      where.alertStatus = alertStatus;
    }

    // Filter by price range
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin && !isNaN(parseInt(priceMin))) {
        where.price[Op.gte] = parseInt(priceMin); // Price greater than or equal to priceMin
      } else if (priceMin) {
        return res.status(400).json({ error: 'Invalid priceMin format' });
      }

      if (priceMax && !isNaN(parseInt(priceMax))) {
        where.price[Op.lte] = parseInt(priceMax); // Price less than or equal to priceMax
      } else if (priceMax) {
        return res.status(400).json({ error: 'Invalid priceMax format' });
      }
    }

    // Sorting products based on query param (sort)
    let order = [];
    if (sort) {
      const [key, direction] = sort.split(':'); // Example: sort=name:asc or sort=price:desc
      order.push([key, direction.toUpperCase()]);
    }

    // Pagination logic
    const itemsPerPage = limit ? parseInt(limit) : 10; // Default limit: 10
    const currentPage = page ? parseInt(page) : 1;
    const offset = (currentPage - 1) * itemsPerPage;

    // Find products with filters, sorting, and pagination
    const products = await Product.findAll({
      where,
      order,
      limit: itemsPerPage,
      offset,
    });

    // Return the filtered products
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
