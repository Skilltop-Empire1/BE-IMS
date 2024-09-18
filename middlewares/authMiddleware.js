// //********import lib rarides */
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const userModel = require("../models/index");

// const loginJWTAthentication = async (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) {return res.status(401).json({ message: "Access denied" })};
//   try {
//     // Verify the token
//     const verify = jwt.verify(token, process.env.SECRET_KEY)
//     req.user = await userModel.user.findOne({email: verify.email})

//     if(!req.user){
//       return res.status(401).json({error: "Invalid token. User not found"})
//     }
//     next();  
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ msg: "invalid token" });
//   }
// };

// module.exports = loginJWTAthentication;


//********import lib rarides */
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/index");

const loginJWTAthentication = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // Verify the token
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    
    // Check if userId or email exists in the verified token
    if (!verify.email) {
      return res.status(401).json({ error: "Invalid token. User ID or email not found" });
    }
    // If using email to find the user
    req.user = await userModel.user.findOne({ email: verify.email });
    if (!req.user) {
      console.log(req.user)
      return res.status(401).json({ error: "Invalid token. User not found" });
    }

    next();  
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = loginJWTAthentication;
