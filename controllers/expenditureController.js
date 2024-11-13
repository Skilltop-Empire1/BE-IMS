const { Expenditure,Staff,Store } = require('../models');
const cloudinary = require("../config/cloudinary")
const {expenditureValidationSchema} = require("../validations/expenditureValidation");


exports.createExpenditure = async (req, res) => {
  try {
    const {
      type,
      category,
      paymentMethod, // Optional for OPEX
      description,
      annualDepreciation, // Optional for CAPEX
      vendor,
      amount,
      notes,
      dateOfExpense,
      expectedLifespan // Optional for CAPEX
    } = req.body;

   //validate request body
   const {error} = expenditureValidationSchema.validate(req.body)
   if(error){
        return res.status(400).json({ message: error.details[0].message })
   }
    //find store id
    let { userId, role } = req.user; // Assuming req.user is the object
    userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
    const store = await Store.findOne({
      where:{userId}
    });
    if(!store){
        return res.status(404).json({message:"store not found"})
    }
    const {storeId} = store
    //upload receipt if it exists
   let url;
   if(req.file){
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder:"receipt",
        width:300,
        crop:"scale"
    })
     url = result.url
   }
  //check if the expenditure category already exists
  const expendExist = await Expenditure.findOne({
    where:{type,category}
  })
  if(expendExist){
    return res.status(409).json({message:"Expenditure CAPEX OR OPEX already exist"})
  }
    // Create a new Expenditure entry with the data from the request body
    const newExpenditure = await Expenditure.create({
      type,
      category,
      paymentMethod,
      description,
      annualDepreciation,
      vendor,
      amount,
      notes,
      storeId,
      dateOfExpense,
      uploadReceipt:url,
      expectedLifespan,
    });

    res.status(201).json(newExpenditure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to create expenditure' });
  }
};

exports.getAllExpenditures = async (req, res) => {
    try {
      let { userId, role } = req.user; // Assuming req.user is the object
      userId = role === 'superAdmin' ? userId : (await Staff.findOne({ where: { staffId: userId } })).userId;
      const expenditures = await Expenditure.findAll({
        include:[{model:Store,where:{userId}}]
      });
      res.status(200).json(expenditures);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve expenditures' });
    }
  };

  
  exports.getExpenditureById = async (req, res) => {
    try {
      const { id } = req.params;
      const expenditure = await Expenditure.findByPk(id);
      if (!expenditure) {
        return res.status(404).json({ error: 'Expenditure not found' });
      }
      res.status(200).json(expenditure);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve expenditure' });
    }
  };

  exports.updateExpenditure = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        type,
        category,
        paymentMethod,
        description,
        annualDepreciation,
        vendor,
        amount,
        notes,
        dateOfExpense,
        uploadReceipt,
        expectedLifespan,
      } = req.body;
   
      const expenditure = await Expenditure.findByPk(id);
      if (!expenditure) {
        return res.status(404).json({ error: 'Expenditure not found' });
      }
      //update recepit if it exists
      const url = expenditure.uploadReceipt
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path,{
                folder:"receipt",
                width:300,
                size:"scale"
            })
            url = result.url
         }
      const updatedExpenditure = await expenditure.update({
        type:type || expenditure.type,
        category:category || expenditure.category,
        paymentMethod:paymentMethod || expenditure.paymentMethod,
        description:description || expenditure.description,
        annualDepreciation:annualDepreciation || expenditure.annualDepreciation,
        vendor:vendor || expenditure.vendor,
        amount:amount || expenditure.amount,
        notes:notes || expenditure.notes,
        dateOfExpense:dateOfExpense || expenditure.dateOfExpense,
        uploadReceipt:url || expenditure.uploadReceipt,
        expectedLifespan:expectedLifespan || expenditure.expectedLifespan,
      });
  
      res.status(200).json(updatedExpenditure);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update expenditure' });
    }
  };
  

  exports.deleteExpenditure = async (req, res) => {
    try {
      const { id } = req.params;
      const expenditure = await Expenditure.findByPk(id);
      if (!expenditure) {
        return res.status(404).json({ error: 'Expenditure not found' });
      }
      await expenditure.destroy();
      res.status(200).json({ message: 'Expenditure deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete expenditure' });
    }
  };
  