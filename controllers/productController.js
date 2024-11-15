const { Product,Staff,Store,Category } = require('../models'); // Import the Product model
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
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    const products = await Product.findAll({
      include:[{model:Store,where:{userId}},{model:Category,atttributes:['name']}]
    });
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
    const { error } = updateProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let url = product.prodPhoto; 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "image",
        width: 300,
        crop: "scale",
      });
      
      url = result.url; 
    }
    await product.update({
      name: name || product.name,
      price: price || product.price,
      itemCode: itemCode || product.itemCode,
      prodPhoto: url, 
      alertStatus: alertStatus || product.alertStatus,
      quantity: quantity || product.quantity,
      categoryId: categoryId || product.categoryId,
      storeId: storeId || product.storeId,
      storeAvailable: storeAvailable || product.storeAvailable,
      prodDate: prodDate || product.prodDate,
    });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.prodId);
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
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    const products = await Product.findAll({include:[{model:Store,where:{userId}}], where: { categoryId: req.params.categoryId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get products by store
exports.getProductsByStore = async (req, res) => {
  try {
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    const products = await Product.findAll({include:[{model:Store,where:{userId}}], where: { storeId: req.params.storeId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.praodId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const { error } = updateStockSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
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
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    const { availability } = req.query; 
    const products = await Product.findAll({
      include:[{model:Store,where:{userId}}],
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
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
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
    const where = {};
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (categoryId && !isNaN(parseInt(categoryId))) {
      where.categoryId = parseInt(categoryId);
    } else if (categoryId) {
      return res.status(400).json({ error: 'Invalid categoryId format' });
    }
    if (storeId && !isNaN(parseInt(storeId))) {
      where.storeId = parseInt(storeId);
    } else if (storeId) {
      return res.status(400).json({ error: 'Invalid storeId format' });
    }
    if (alertStatus) {
      where.alertStatus = alertStatus;
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin && !isNaN(parseInt(priceMin))) {
        where.price[Op.gte] = parseInt(priceMin); 
      } else if (priceMin) {
        return res.status(400).json({ error: 'Invalid priceMin format' });
      }
      if (priceMax && !isNaN(parseInt(priceMax))) {
        where.price[Op.lte] = parseInt(priceMax); 
      } else if (priceMax) {
        return res.status(400).json({ error: 'Invalid priceMax format' });
      }
    }
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
    },{
      include:[{model:Store,where:{userId}}]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



let transferLog = [];

exports.transferProduct = async (req, res) => {
  try {
    const { name, quantity, currentStore, reasonForTransfer, currentCategory, destinationStore, destinationCategory } = req.body;
    let { userId, role } = req.user;  // Get userId and role from the authenticated user

    // check if the userId belongs to a staff member
    if (role !== 'superAdmin') {
      const staffRecord = await Staff.findOne({
        where: { staffId: userId }, 
      });

      // If no staff record is found, return 
      if (!staffRecord) {
        return res.status(404).json({ message: 'User not found as staff member.' });
      }
      // Set the userId to the userId associated with the staff member
      userId = staffRecord.userId; 
    }
    // Find the current store record for the given userId
    const currentStoreRecord = await Store.findOne({
      where: { storeName: currentStore, userId },
    });

    if (!currentStoreRecord) {
      return res.status(404).json({ message: 'Current store not found for this user.' });
    }

    const destinationStoreRecord = await Store.findOne({
      where: { storeName: destinationStore, userId },
    });

    if (!destinationStoreRecord) {
      return res.status(404).json({ message: 'Destination store not found for this user.' });
    }

    const currentCategoryRecord = await Category.findOne({
      where: { name: currentCategory, storeId: currentStoreRecord.storeId },
    });

    if (!currentCategoryRecord) {
      return res.status(404).json({ message: 'Current category not found in the specified store.' });
    }

    const destinationCategoryRecord = await Category.findOne({
      where: { name: destinationCategory, storeId: destinationStoreRecord.storeId },
    });

    if (!destinationCategoryRecord) {
      return res.status(404).json({ message: 'Destination category not found in the specified store.' });
    }

    // Step 3: Proceed with the original transfer logic using the userId and category IDs
    const productRecord = await Product.findOne({
      where: {
        name,
        categoryId: currentCategoryRecord.catId,
        storeId: currentStoreRecord.storeId,
      },
    });

    if (!productRecord) {
      return res.status(404).json({ message: 'Product not found in the specified category and store.' });
    }

    // Check if the user has permission to transfer the product
    if (role !== 'superAdmin') {
      // Ensure that the user is authorized to transfer between stores they own
      if (currentStoreRecord.userId !== userId || destinationStoreRecord.userId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to transfer products between these stores.' });
      }
    }

    // Ensure stores belong to the same user if not a super admin
    if (currentStoreRecord.userId !== destinationStoreRecord.userId) {
      return res.status(400).json({ message: 'Cannot transfer products between different companies.' });
    }

    // Validate quantity
    if (productRecord.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity for transfer.' });
    }

    // Step 4: Update quantities and proceed with transfer
    await Product.update(
      { quantity: productRecord.quantity - quantity },
      { where: { prodId: productRecord.prodId } }
    );

    const destinationProduct = await Product.findOne({
      where: {
        name,
        categoryId: destinationCategoryRecord.catId,
        storeId: destinationStoreRecord.storeId,
      },
    });

    if (destinationProduct) {
      await Product.update(
        { quantity: destinationProduct.quantity + quantity },
        { where: { prodId: destinationProduct.prodId } }
      );
    } else {
      await Product.create({
        name: productRecord.name,
        price: productRecord.price,
        itemCode: productRecord.itemCode,
        prodPhoto: productRecord.prodPhoto,
        alertStatus: productRecord.alertStatus,
        quantity,
        categoryId: destinationCategoryRecord.catId,
        storeId: destinationStoreRecord.storeId,
      });
    }
    // Log the transfer
    const transferDetails = {
      userId: userId,
      product: {
        name,
        transferredQuantity: quantity,
        from: {
          store: currentStoreRecord.storeName,
          category: currentCategoryRecord.name,
        },
        to: {
          store: destinationStoreRecord.storeName,
          category: destinationCategoryRecord.name,
        },
      },
    };
    transferLog.push(transferDetails);
    // Send success response
    res.status(200).json({
      message: 'Product transfer successful.',
      userId,
      product: {
        name,
        transferredQuantity: quantity,
        from: { store: currentStoreRecord.storeName, category: currentCategoryRecord.name },
        to: { store: destinationStoreRecord.storeName, category: destinationCategoryRecord.name },
      },
    });
  } catch (error) {
    console.error('Error during product transfer:', error);
    res.status(500).json({ message: 'An error occurred during product transfer.', error });
  }
};
 // Get all transfers related to the user's company
 exports.getTransferLog = async (req, res) => {
   try {
     const { userId, role } = req.user;
 
     // Get the company-related userId for staff or superAdmin role
     const companyUserId = role === 'superAdmin' ? userId : 
       (await Staff.findOne({ where: { staffId: userId } })).userId;
 
     const companyTransfers = transferLog.filter(
       (transfer) => transfer.userId === companyUserId
     );
 
     res.status(200).json({ transfers: companyTransfers });
   } catch (error) {
     console.error('Error fetching transfers:', error);
     res.status(500).json({ message: 'An error occurred while fetching transfer logs.' });
   }
 };

exports.skillTopImage = async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "image",   
          width: 300,    
          crop: "scale"      
      });
      res.json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url 
      });
      console.log(imageUrl)
  } catch (error) {
      res.status(500).json({
          message: "Image upload failed",
          error: error.message
      });
  }
};

