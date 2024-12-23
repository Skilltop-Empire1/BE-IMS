const { toDefaultValue } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userName: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.STRING,
      allowNull: true, 
      defaultValue: "superAdmin"
    },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    userLogo: {
      type: DataTypes.UUID,
      references: { model: "Profiles", key: "profileId" },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Profile, { foreignKey: "userId" });
    User.hasMany(models.SalesRecord, { foreignKey: "userId" });
    User.hasMany(models.Store, { foreignKey: "userId" });
  };

  return User;
};
