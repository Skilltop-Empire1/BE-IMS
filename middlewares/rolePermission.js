const rolesPermissions = require('./roles');

// Authorization middleware
const authorize = (action) => {
  return (req, res, next) => {
    const userRole = req.user.role; 
    if (rolesPermissions[userRole] && rolesPermissions[userRole].includes(action)) {
      return next(); 
    }
    return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
  };
};

module.exports = authorize;
