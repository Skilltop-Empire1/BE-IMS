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

// Convert currentPayment and totalAmount to numbers for accurate comparisons
const currentPaymentNumber = currentPayment ? parseFloat(currentPayment) : null;
const totalAmountNumber = totalAmount ? parseFloat(totalAmount) : null;

// Check for missing or invalid totalAmount
if (totalAmountNumber === null || isNaN(totalAmountNumber) || totalAmountNumber <= 0) {
  return res.status(400).json({
    message: "Invalid or missing total amount. It must be a number greater than 0.",
  });
}

// Handle paymentOption-specific validations
if (paymentOption === "part_payment") {
  if (currentPaymentNumber === null || isNaN(currentPaymentNumber)) {
    return res.status(400).json({
      message: "Invalid or missing current payment for part payment option.",
    });
  }

  if (currentPaymentNumber <= 0 || currentPaymentNumber >= totalAmountNumber) {
    return res.status(400).json({
      message:
        "For part payment, current payment must be greater than 0 and less than the total amount.",
    });
  }

  // Calculate the balance for part payment
  salesRecordData.balance = totalAmountNumber - currentPaymentNumber;
} else if (paymentOption === "full") {
  if (currentPaymentNumber === null || isNaN(currentPaymentNumber)) {
    return res.status(400).json({
      message: "Invalid or missing current payment for full payment option.",
    });
  }

  if (currentPaymentNumber !== totalAmountNumber) {
    return res.status(400).json({
      message: "For full payment, current payment must equal the total amount.",
    });
  }

  // No balance for full payment
  salesRecordData.balance = 0;
} else if (paymentOption === "credit") {
  if (currentPaymentNumber !== null && currentPaymentNumber > 0) {
    return res.status(400).json({
      message: "For credit payment, current payment must be 0 or not provided.",
    });
  }

  // Entire amount is due for credit payment
  salesRecordData.balance = totalAmountNumber;
} else {
  return res.status(400).json({
    message: "Invalid payment option. Allowed values are 'part_payment', 'full', or 'credit'.",
  });
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
      const updatedFields = req.body;
  
      // Fetch the existing record
      const salesRecord = await SalesRecord.findByPk(id);
      if (!salesRecord) {
        return res.status(404).json({ message: "Sales record not found" });
      }
  
      // Extract values from the request body or use existing values
      const totalAmount = parseFloat(updatedFields.totalAmount) || salesRecord.totalAmount;
      const currentPayment = parseFloat(updatedFields.currentPayment) || salesRecord.currentPayment;
      const paymentOption = updatedFields.paymentOption || salesRecord.paymentOption;
  
      // Validate payment-related inputs only if relevant fields are being updated
      let balance = salesRecord.balance; // Default to the existing balance
      if (updatedFields.currentPayment || updatedFields.totalAmount || updatedFields.paymentOption) {
        if (paymentOption === "part_payment") {
          if (currentPayment <= 0 || currentPayment >= totalAmount) {
            return res.status(400).json({
              message: "For part payment, current payment must be greater than 0 and less than total amount.",
            });
          }
          balance = totalAmount - currentPayment;
        } else if (paymentOption === "full") {
          if (currentPayment !== totalAmount) {
            return res.status(400).json({
              message: "For full payment, current payment must equal total amount.",
            });
          }
          balance = 0; // No balance for full payment
        } else if (paymentOption === "credit") {
          if (currentPayment && currentPayment > 0) {
            return res.status(400).json({
              message: "For credit payment, current payment must be 0.",
            });
          }
          balance = totalAmount; // Entire amount is due
        }
      }
  
      // Update the sales record with recalculated balance and other fields
      const [updated] = await SalesRecord.update(
        { ...updatedFields, balance }, // Include recalculated balance if applicable
        { where: { saleId: id } }
      );
  
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




