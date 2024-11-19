//************** Import libraries ************ *
const {Demo} = require('../models')
const { Op } = require("sequelize");
const{ demoValidation} = require("../validations/userValidation")

// controller class
class UserObject {

  // subscribe to a plann
  requestDemo = async (req, res) => {
    const { firstName, lastName, email, phone, state, title, company } = req.body;
    try {
      // validate the demo req body
      const { error } = demoValidation.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }
    // check if the user is  already subscribed
    const demoRequested = await Demo.findOne({ 
      where: { 
        [Op.or]: [{ email }, { phone }, {company}],
      } 
    });
    if (demoRequested) {
      return res.status(200).json({msg:`Demo requested already by your company`});
    }
    const demoRequest = await Demo.create({
      firstName,
      lastName,
      email,
      phone,
      state,
      title,
      company
  });

  if(demoRequest){
    return res.status(201).json({msg: `Demo request successful` })
  }  
    } catch (error) {
      throw error
    }
  };


  //query subscribed list
  demoList = async (req,res)=>{
    const demoList = await Demo.findAll()
    try {
      if(demoList){
        return res.status(200).json(demoList)
      }
      
    } catch (error) {
      throw error
    }

  }



  
}

//********** instance of the UserObject ********** */
const userObject = new UserObject();

//************Export the instant */
module.exports = userObject;
