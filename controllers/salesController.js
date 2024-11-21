const { ENUM } = require("sequelize");
const {SalesRecord,Category,Staff, Product, Store}  = require("../models/");
const {
  salesRecordSchema,
} = require("../salesRecordValidation");

const { createNotifications } = require("./notificationController");


// Create a new sales record
const createSalesRecord = async (req, res) => {
  try {

let { userId, role } = req.user;

// Resolve userId for non-superAdmin roles
if (role !== 'superAdmin') {
  const staff = await Staff.findOne({ where: { staffId: userId } });
  if (!staff) {
    return res.status(403).json({ message: 'Staff not found or unauthorized' });
  }
  userId = staff.userId; // Update userId to the linked user's ID
}

const {
  productId,
  storeId,
  categoryId,
  quantity,
  paymentOption,
  paymentMethod,
  totalAmount,
  currentPayment,
  paymentDate,
  nextPaymentDate,
  customerPhone,
  customerName,
} = req.body;

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

//Validate input
// if (!productId || !storeId || !categoryId || !quantity || !totalAmount) {
//   return res.status(400).json({ message: 'Missing required fields' });
// }
if (!['full', 'part_payment', 'credit'].includes(paymentOption)) {
  return res.status(400).json({ message: 'Invalid payment option' });
}

if (paymentOption !== 'credit' && !['cash', 'POS', 'transfer'].includes(paymentMethod)) {
  return res.status(400).json({ message: 'Invalid payment method' });
}

// Prepare sales record data
let salesRecordData = {
  userId, // Use resolved userId
  productId,
  quantity,
  paymentOption,
  paymentMethod:paymentOption === 'credit' ? 'credit' : paymentMethod,
  categoryId,
  storeId,
  totalAmount,
  customerPhone,
  customerName,
  paymentDate,
  nextPaymentDate,
  currentPayment,
  productPrice: product.price,
  soldDate: new Date(),
};

// Include optional customer name
if (customerName && customerName.trim() !== "") {
  salesRecordData.customerName = customerName.trim();
}

//Handle paymentOption-specific validations
if (paymentOption === 'part_payment') {
  if (!currentPayment || currentPayment <= 0 || currentPayment >= totalAmount) {
    return res.status(400).json({
      message: 'For part payment, current payment must be greater than 0 and less than total amount.',
    });
  }
  salesRecordData.balance = totalAmount - currentPayment;
} else if (paymentOption === 'full') {
  if (currentPayment !== totalAmount) {
    return res.status(400).json({
      message: 'For full payment, current payment must equal total amount.',
    });
  }
  salesRecordData.balance = 0; // No balance for full payment
} else if (paymentOption === 'credit') {
  if (currentPayment && currentPayment > 0) {
    return res.status(400).json({
      message: 'For credit payment, current payment must be 0.',
    });
  }
  salesRecordData.balance = totalAmount;
}


// Create sales record
const newSalesRecord = await SalesRecord.create(salesRecordData);

// Emit notification via Socket.io
const io = req.app.get('io');
if (io) {
  await createNotifications(io, productId, quantity, userId, res);
} else {
  console.warn('Socket.io instance not found. Notifications not sent.');
}
// Step 6: Create a notification for the sale.

await createNotifications(io, productId, quantity, userId, res);
// Return success response
return res.status(201).json({
  success: true,
  data: newSalesRecord,
});

} catch (err) {
console.error('Error creating sales record:', err);
return res.status(500).json({ message: 'Internal Server Error' });
}}
;
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
            attributes: ['storeName','location','storePhoto'],
          },
        ],
        attributes: [
          'saleId',
          'productId',
          'storeId',
          'categoryId',
          'quantity',
          'paymentOption',
          'totalAmount',
          'customerPhone',
          'customerName',
          'paymentMethod',
          'productPrice',
          'soldDate',
          'balance',
          'nextPaymentDate',
          'currentPayment',
          'paymentDate'
        ],
      });
      return res.json({
        status:200,
        success: true,
        data: salesRecords,
      });
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
      const { productId } = req.params; 
      const salesRecords = await SalesRecord.findAll({
        where: {
          productId: productId, 
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




