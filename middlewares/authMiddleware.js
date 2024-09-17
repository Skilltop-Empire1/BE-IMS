//********import lib rarides */
const jwt = require("jsonwebtoken");
require("dotenv").config()
const userModel = require("../models/index");


const loginJWTAthentication = async (req, res, next) => {
  // Middleware for protected routes
  const token = req.header('x-auth-token') // Get token from Authorization header
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send('Invalid token.');
      req.user = user; // Attach user info to request
      next()
    })
  } catch (err) {
    console.log(error)
    res.status(401).json({ msg: "not authorized" });
  }
};

module.exports = loginJWTAthentication



// auth.js
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
//   if (!token) return res.status(403).send('Token is required.');

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).send('Invalid token.');
//     req.user = user; // Attach user info to request
//     next();
//   });
// };

// module.exports = verifyToken;
