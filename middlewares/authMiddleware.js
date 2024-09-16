const jwt = require("jsonwebtoken");
const rolesPermissions = require("../utils/rolePermission");

const loginJWTAthentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; 
  }
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user; 
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided, unauthorized" });
  }
};

// Authorization middleware
const permission = (action) => {
    return (req, res, next) => {
      const userRole = req.user.role; 
  
      if (rolesPermissions[userRole] && rolesPermissions[userRole].includes(action)) {
        return next(); 
      }
  
      return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
    };
  };


module.exports = {loginJWTAthentication,permission};






