
const multer = require('multer');
const fs = require('fs');
const path = require('path'); 
const { Store , Product, SalesRecord, Category} = require('../models');
const { validatePhoneNumber } = require('../utils/validators');
const { Op, Sequelize } = require('sequelize');// Only import Op from Sequelize

const sequelize = Sequelize;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the dynamically created directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});

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
            const {storeName, location, storeContact, description,noOfStaff,storeManager} = req.body;

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
            let storePhoto = null;
            if (req.file) {
                storePhoto = req.file.path; // Save the file path in the database
            }

            // Create the store in the database
            const store = await Store.create({
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






