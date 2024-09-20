
const multer = require('multer');
const fs = require('fs');
const path = require('path'); 
const cloudinary = require('../config/cloudinary');
const { storeSchema } = require('../validations/storeValidation');
const { Store , Product, SalesRecord, Category,User} = require('../models');
const { validatePhoneNumber } = require('../validations/numberValidator');
const { Op, Sequelize } = require('sequelize');// Only import Op from Sequelize
const { v4: uuidv4 } = require('uuid');
// const cloudinary = require('cloudinary').v2;

const sequelize = Sequelize;
const storage = multer.memoryStorage();
// Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Use the dynamically created directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
//     }
// });

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimeType && extName) {
        return cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
      }
    }
  }).single('storePhoto');
  
  // Create store with image upload
  exports.createStore = async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error: ' + err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      try {
        // Validate the request body
        const { error } = storeSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

            const { userId, storeName, location, storeContact, description, noOfStaff, storeManager } = req.body;

            // Check if store name or location already exists
            if (await Store.findOne({ where: { storeName } })) {
                return res.status(400).json({ error: 'Store Name already exists' });
            }

            if (await Store.findOne({ where: { location } })) {
                return res.status(400).json({ error: 'A Store is already in this location' });
            }

            // Validate phone number format
            if (!validatePhoneNumber(storeContact)) {
                return res.status(400).json({ error: 'Invalid phone number format' });
            }

            // If image was uploaded, save its file path
            // let storePhoto = null;
            // if (req.file) {
            //     storePhoto = req.file.path; // Save the file path in the database
            // }

             // If image was uploaded, save its Cloudinary URL
      let storePhoto = null;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ public_id: uuidv4() }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }).end(req.file.buffer);
        });
        storePhoto = result.secure_url;
      }

            // Create the store in the database
            const store = await Store.create({
                userId,
                storeName,
                location,
                storeContact,
                storePhoto, // Store image file path
                description,
                noOfStaff,
                storeManager
            });

            res.status(201).json(store);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

exports.getAllStores = async (req, res) => {
    try {
        console.log("userId",req.user.dataValues.userId);
        const stores = await Store.findAll();
        res.json(stores);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getStoreInfo = async (req, res) => {
    const storeId = req.params.storeId;

    try {
        // 0. Fetch the store details including noOfStaff
        const store = await Store.findOne({
            where: { storeId },
            attributes: ['noOfStaff']  // Fetch noOfStaff instead of totalEmployees
        });

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        // 1. Fetch total items in the store
        const totalItems = await Product.sum('quantity', { where: { storeId } }) || 0;

        // 2. Find the low stock item (using alertStatus or quantity < 10)
        const lowStockItem = await Product.findOne({
            where: {
                storeId,
                [Op.or]: [
                    { alertStatus: 'low-10' },
                    { quantity: { [Op.lt]: 10 } }
                ]
            },
            attributes: ['name', 'quantity']
        });

        // 3. Find the most sold item
        const mostSoldItem = await SalesRecord.findOne({
            where: { storeId },
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('SalesRecord.quantity')), 'totalSold']
            ],
            group: ['SalesRecord.productId', 'Product.prodId', 'Product.name'],
            order: [[sequelize.fn('SUM', sequelize.col('SalesRecord.quantity')), 'DESC']],
            limit: 1,
            include: {
                model: Product,
                as: 'Product',
                attributes: ['prodId', 'name']
            }
        });

        // 4. Find the least sold item
        const leastSoldItem = await SalesRecord.findOne({
            where: { storeId },
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('SalesRecord.quantity')), 'totalSold']
            ],
            group: ['SalesRecord.productId', 'Product.prodId', 'Product.name'],
            order: [[sequelize.fn('SUM', sequelize.col('SalesRecord.quantity')), 'ASC']],
            limit: 1,
            include: {
                model: Product,
                as: 'Product',
                attributes: ['prodId', 'name']
            }
        });

        // 5. Find the most popular category
        const mostPopularCategory = await SalesRecord.findOne({
            where: { storeId },
            attributes: [
                'categoryId',
                [sequelize.fn('COUNT', sequelize.col('SalesRecord.categoryId')), 'totalSales']
            ],
            group: ['SalesRecord.categoryId', 'Category.catId', 'Category.name'],
            order: [[sequelize.fn('COUNT', sequelize.col('SalesRecord.categoryId')), 'DESC']],
            limit: 1,
            include: {
                model: Category,
                as: 'Category',
                attributes: ['catId', 'name']
            }
        });

        // Construct the response, now including noOfStaff from the store table
        const storeInfoDTO = {
            totalItems: totalItems || 0,
            lowStockItem: lowStockItem ? lowStockItem.name : 'N/A',
            mostSoldItem: mostSoldItem ? mostSoldItem.Product.name : 'N/A',
            leastSoldItem: leastSoldItem ? leastSoldItem.Product.name : 'N/A',
            mostPopularCategory: mostPopularCategory ? mostPopularCategory.Category.name : 'N/A',
            totalEmployees: store.noOfStaff || 0  // Use noOfStaff as totalEmployees
        };

        res.json(storeInfoDTO);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchStore = async (req, res) => {
    const query = req.query.query;

    // Validate query parameter
    if (!query) {
        return res.status(400).json({ error: 'Search query parameter is required.' });
    }

    // Sanitize query to prevent SQL injection (though Sequelize should handle this)
    const sanitizedQuery = query.trim();

    // Check if query is not empty after trimming
    if (sanitizedQuery === '') {
        return res.status(400).json({ error: 'Search query cannot be empty.' });
    }

    try {
        // Perform the search
        const stores = await Store.findAll({
            where: {
                storeName: {
                    [Op.like]: `%${sanitizedQuery}%`
                }
            }
        });

        // Handle case where no results are found
        if (stores.length === 0) {
            return res.status(404).json({ message: 'No stores found matching the query.' });
        }

        // Return the found stores
        res.status(200).json(stores);
    } catch (error) {
        // Handle any errors that occur during the search
        console.error('Error searching for stores:', error);
        res.status(500).json({ error: 'An error occurred while searching for stores. Please try again later.' });
    }
};


exports.filterByLocation = async (req, res) => {
    try {
        // Fetch all stores and get unique locations
        const stores = await Store.findAll({ attributes: ['location'] }); // Only get the 'location' field
        const locations = [...new Set(stores.map(store => store.location))]; // Remove duplicates
        
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching locations' });
    }
};

exports.getStoreOverview = async (req, res) => {
    try {
      // Fetch all stores
      const stores = await Store.findAll({
        include: [
          {
            model: Product,
            attributes: ['quantity', 'price'],  // Fetch quantity and price for stock calculations
          },
        ],
      });
  
      
      const storeOverview = stores.map(store => {
        const totalItems = store.Products.reduce((acc, product) => acc + product.quantity, 0); // Total items
        const totalStockValue = store.Products.reduce((acc, product) => acc + (product.price * product.quantity), 0); // Total stock value

        return {
          storeId: store.storeId,
          storeName: store.storeName,
          totalItems: totalItems || 'Not assigned',  // In case there's no data
          totalStockValue: totalStockValue || 'Not assigned', // In case there's no data
          noOfStaff: store.noOfStaff || 'Not assigned',  // Use staff count from the Store model
        };
      });

      return res.status(200).json({
        success: true,
        data: storeOverview,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  };

// Delete store by ID (THIS FNCTION IS NOT USED IN THE CURRENT PROJ BUT IS HERE JUST IN CASE)
exports.deleteStoreById = async (req, res) => {
    const storeId = req.params.storeId; // Extract store ID from request parameters

    try {
        const store = await Store.findByPk(storeId);

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Delete the store from the database
        await store.destroy();
        res.status(200).json({ message: 'Store deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Edit store by ID (THIS FNCTION IS NOT USED IN THE CURRENT PROJ BUT IS HERE JUST IN CASE)
exports.editStoreById = async (req, res) => {
    const storeId = req.params.storeId; // Extract store ID from request parameters

    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const { storeName, location, storeContact, description, noOfStaff, storeManager } = req.body;

            // Find the store by its ID
            const store = await Store.findByPk(storeId);

            if (!store) {
                return res.status(404).json({ error: 'Store not found' });
            }

            // Validate phone number format
            if (storeContact && !validatePhoneNumber(storeContact)) {
                return res.status(400).json({ error: 'Invalid phone number format' });
            }

            // If image was uploaded, save its file path
            let storePhoto = store.storePhoto; // Keep existing photo by default
            if (req.file) {
                storePhoto = req.file.path; // Update the file path if a new image was uploaded
            }

            // Update the store with new data
            await store.update({
                storeName: storeName || store.storeName,  // Keep original values if not provided
                location: location || store.location,
                storeContact: storeContact || store.storeContact,
                storePhoto,  // Updated or existing image path
                description: description || store.description,
                noOfStaff: noOfStaff || store.noOfStaff,
                storeManager: storeManager || store.storeManager
            });

            res.status(200).json(store);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};



// CREATE A TEMPORARY USER TO CREATE STORE. 
exports.createTemporaryUserForTest = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;

        // Ensure required fields are provided
        if (!userName || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new temporary user
        const newUser = await User.create({
            userName,
            email,
            password, 
            role
        });

        res.status(201).json({
            message: 'Temporary user created successfully!',
            data: newUser
        });

    } catch (error) {
        console.error('Error creating temporary user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};