const rolesPermissions = require('../utils/rolePermission');

// Authorization middleware
const authorize = (label,action) => {
  return (req, res, next) => {
    let {role, permission} = req.user;
    // if (rolesPermissions[userRole] && rolesPermissions[userRole].includes(action)) {
    //   return next(); 
    // }
    if (role === "superAdmin") {
      return next()
    }else{
    let perm = permission.find((x) => x.label === label);
    if (perm && perm[action]) {
      console.log(perm);
       return next()
    }}
        
  
    return res.status(403).json({ message: 'Forbidden: You do not have the required permission' });
  };
};

module.exports = authorize;
