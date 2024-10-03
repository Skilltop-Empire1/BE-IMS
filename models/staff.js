module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    staffId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'userId' },
    },
    username: { 
      type: DataTypes.STRING(100), 
      allowNull: true 
    },
    email: { 
      type: DataTypes.STRING(100), 
      allowNull: false,
      unique: true 
    },
    password: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'terminated'),
      allowNull: false,
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Employee',
    },
    storeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Stores', key: 'storeId' },
    },
    addedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  Staff.associate = (models) => {
    Staff.belongsTo(models.Store, { foreignKey: 'storeId' });
    Staff.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Staff;
};
