//********import libraries */
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/index");

const loginJWTAthentication = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  let token
  if (authHeader && authHeader.startsWith('Bearer')){
    token = authHeader.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // Verify the token
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    console.log(verify)
    
    // Check if userId or email exists in the verified token
    // if (!verify.email) {
      // return res.status(401).json({ error: "Invalid token. User ID or email not found" });
    // }
    // If using email to find the user
    
    // const user = await userModel.User.findOne({ email: verify.email });
    // if (!user){
    //   const staff =await userModel.Staff.findOne({email})
    //   if(!staff){
    //     return res.status(401).json({msg: "staff token not found"})
    //   }
    //   req.user = staff
    // }else{
    //   req.user = user
    // }

    const {id,email,role} = verify
    console.log("verify",verify,id,email,role)
    req.user = {userId:id,email,role}
    next();  
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = loginJWTAthentication;
