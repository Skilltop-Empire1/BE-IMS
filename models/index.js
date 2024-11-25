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
const Notification = require("./Notification")(sequelize, DataTypes)
const Expenditure = require("./Expenditure")(sequelize, DataTypes)
const Plan = require("./Plan")(sequelize, DataTypes)
const Demo = require("./Demo")(sequelize, DataTypes)
// Define the db object with models and sequelize
const db = {
  sequelize,
  User,
  Profile,
  Product,
  Category,
  Store,
  SalesRecord,
  Staff,
  Notification,
  Expenditure,
  Plan,
  Demo,
};

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
