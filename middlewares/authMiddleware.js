//********import lib rarides */
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/index");

const loginJWTAthentication = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized! Token is invalid." });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "not authorized" });
  }
};

module.exports = loginJWTAthentication;
