const { validate } = require("node-cron");
const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define("Plan", {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    businessName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true},
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    subscribedPlan: { type: DataTypes.STRING, allowNull: false },
 
  });


  return Plan;
};
