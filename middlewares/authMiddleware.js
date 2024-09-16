//********import lib rarides */
const jwt = require("jsonwebtoken");
require("dotenv").config()
const userModel = require("../models/index");


const loginJWTAthentication = async (req, res, next) => {
  // Middleware for protected routes
  const token = req.headers.authourization.split(' ')[1]//("authorization")?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.user.findOne({verified.email});
    next();
  } catch (err) {
    res.status(400).json({ message: "fobbiden" });
  }
  // const token = req.cookies.token
  // try {
  //   const user = jwt.verify(token, process.env.SECRET_KEY)
  //   req.user = user
  //   next()
  // } catch (error) {
  //   res.clearCookie("token")
  //   return res.send(err)
  //   // res.redirect("/")

  // }

//   const token = req.headers['authorization'];
//   if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//   }
//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id);
//       next();
//   } catch (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//   }
// };



};

module.exports = loginJWTAthentication

