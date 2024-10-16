const { ENUM } = require("sequelize");
const {SalesRecord,Category, Product, Store}  = require("../models/");
const {
  salesRecordSchema,
} = require("../salesRecordValidation");

const { createNotifications } = require("./notificationController");


// Create a new sales record
const createSalesRecord = async (req, res) => {
  try {
    const { productId, storeId, categoryId, quantity, paymentMethod } = req.body;

    // Step 1: Find the product by its ID.
    const product = await Product.findByPk(productId);

    // Step 2: If the product doesn't exist, return a 404 error.
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Check if there's enough stock for the requested quantity.
    if (product.quantity < quantity) {
      return res.status(401).json({ msg: "Insufficient stock" });
    }

    // Step 4: Create the sales record with the current price of the product.
    const newSalesRecord = await SalesRecord.create({
      userId: req.user.userId,
      productId,
      quantity,
      paymentMethod,
      categoryId,
      storeId,
      productPrice: product.price,
      saleDate: new Date(),
    });

    const io = req.app.get("io");
    if (!io) {
      console.error("Socket.io instance not found");
    } else {
      console.log("Socket.io instance retrieved:", io);
    }

    // Step 6: Create a notification for the sale.
    const userId = req.user.userId;
    await createNotifications(io, productId, quantity, userId, res);

    // Step 7: Send the response back with the newly created sales record.
    return res.status(200).send({
      successful: true,
      data: newSalesRecord,
    });

  } catch (err) {
    // Step 8: Handle any errors and return a 500 status if needed.
    console.error("Error creating sales record:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};


  // Get all sales records
  const getSalesRecords = async (req, res) => {
    let { userId, role } = req.user; 
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
  
    try {
      // Fetch sales records with relevant details
      const salesRecords = await SalesRecord.findAll({
        where: { userId: userId },
        include: [
          {
            model: Product,
            attributes: ['name', 'prodPhoto'], 
          },
          {
            model: Store,
            attributes: ['storeName'],
          },
        ],
        attributes: [
          'saleId',
          'productId',
          'storeId',
          'categoryId',
          'quantity',
          'paymentMethod',
          'productPrice', // Include productPrice from SalesRecord
          'soldDate', // Include sale date
        ],
      });
  
      return res.status(200).json(salesRecords);
    } catch (err) {
      console.error("Error fetching sales records:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // Get a single sales record by ID
const getSalesRecordById = async (req, res) => {
    try {
      const { id } = req.params;
      const salesRecord = await SalesRecord.findByPk(id);
      if (!salesRecord) {
        return res.status(404).json({ message: "Sales record not found" });
      }
      return res.status(200).json(salesRecord);
    } catch (err) {
      console.error("Error fetching sales record:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const getSalesRecordByProductId = async (req, res) => {
    try {
      const { productId } = req.params; // Extract productId from request parameters
      const salesRecords = await SalesRecord.findAll({
        where: {
          productId: productId, // Match productId from params
        },
      });
  
      if (salesRecords.length === 0) {
        return res.status(404).json({ message: "No sales records found for this product" });
      }
  
      return res.status(200).json(salesRecords); // Return all matching sales records
    } catch (err) {
      console.error("Error fetching sales records by productId:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  // Update a sales record by ID
 const updateSalesRecord = async (req, res) => {
    try {
      const { id } = req.params;
      // const { error } = salesRecordSchema.validate(req.body);
      // if (error) {
      //   return res.status(400).json({ message: error.details[0].message });
      // }

      const [updated] = await SalesRecord.update(req.body, {
        where: { saleId: id },
      });

      if (updated) {
        const updatedSalesRecord = await SalesRecord.findByPk(id);
        return res.status(200).json(updatedSalesRecord);
      }

      return res.status(404).json({ message: "Sales record not found" });
    } catch (err) {
      console.error("Error updating sales record:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Delete a sales record by ID
 const deleteSalesRecord = async (req, res) => {
    try {
      const {id}  = req.params;
      const deleted = await SalesRecord.destroy({
        where: { saleId: id },
      });

      if (deleted) {
        return res.status(204).json({ message: "record deleted succesfully" });
      }

      return res.status(404).json({ message: "Sales record not found" });
    } catch (err) {
      console.error("Error deleting sales record:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Export class instance
module.exports = {
  createSalesRecord, 
  getSalesRecords, 
  getSalesRecordById, 
  updateSalesRecord, 
  deleteSalesRecord,
  getSalesRecordByProductId
};




