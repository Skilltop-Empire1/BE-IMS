module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
      storeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, references: { model: 'Users', key: 'userId' } },
      storeName: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING },
      storePhoto: { type: DataTypes.STRING },
      noOfStaff: { type: DataTypes.INTEGER },
      storeManager: { type: DataTypes.STRING },
      storeContact: { type: DataTypes.STRING }
    });
  
    Store.associate = (models) => {
      Store.belongsTo(models.User, { foreignKey: 'userId' });
      Store.hasMany(models.Product, { foreignKey: 'storeId' });
      Store.hasMany(models.SalesRecord, { foreignKey: 'storeId' });
      Store.hasMany(models.Category, { foreignKey: 'storeId' });
      Store.hasMany(models.Expenditure, { foreignKey: 'storeId' });
    };
  
    return Store;
  };
  