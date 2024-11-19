//************** Import libraries ************ *
const{ Plan} = require("../models");
const { Op } = require("sequelize");
const{planValidation} = require("../validations/userValidation")

// controller class
class UserObject {

  // subscribe to a plann
  plan = async (req, res) => {
    const { businessName, email, phone, subscribedPlan } = req.body;
    try {
      // validate the plan body
      const { error } = planValidation.validate(req.body);
    if (error) {
      return res.status(404).json(error.details[0].message);
    }
    // check if the user is  already subscribed
    const subscribedUser = await Plan.findOne({ 
      where: { 
        [Op.or]: [{ email }, { phone }, {businessName}],
      } 
    });
    if (subscribedUser) {
      return res.status(200).json({msg:`The Business name, email or phone number is already subscribed to ${subscribedUser.subscribedPlan} plan.`});
    }
    const subscribe = await Plan.create({
      businessName,
      email,
      phone,
      subscribedPlan
  });

  if(subscribe){
    return res.status(201).json({msg: `Subscription to ${subscribe.subscribedPlan} plan successful` })
  }      
    } catch (error) {
      throw error
    }
  };

  //query subscribed list
  planList = async (req,res)=>{
    const planList = await Plan.findAll()
    try {
      if(planList){
        return res.status(200).json(planList)
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
