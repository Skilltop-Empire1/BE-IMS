const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Import models
const User = require("./User")(sequelize, DataTypes);
const Profile = require("./Profile")(sequelize, DataTypes);
const Product = require("./Product")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Store = require("./Store")(sequelize, DataTypes);
const SalesRecord = require("./SalesRecord")(sequelize, DataTypes);
const Staff = require("./staff")(sequelize, DataTypes);

// Define the db object with models and sequelize
const db = {
  sequelize,
  User,
  Profile,
  Product,
  Category,
  Store,
  SalesRecord,
  Staff
};

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
