const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

// Import models
const User = require("./User")(sequelize, DataTypes);
const Profile = require("./Profile")(sequelize, DataTypes);
const Product = require("./Product")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Store = require("./Store")(sequelize, DataTypes);
const SalesRecord = require("./SalesRecord")(sequelize, DataTypes);


const db = {
  sequelize,
  User,
  Profile,
  Product,
  Category,
  Store,
  SalesRecord,
 
};

// Export the db object containing Sequelize instance and all models
module.exports = db;

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

