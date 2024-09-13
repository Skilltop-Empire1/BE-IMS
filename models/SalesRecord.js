module.exports = (sequelize, DataTypes) => {
    const SalesRecord = sequelize.define('SalesRecord', {
        saleId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
      userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'userId' } },
      productId: { type: DataTypes.INTEGER, references: { model: 'Products', key: 'prodId' } },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'POS', 'transfer'),
        allowNull: false
      },
      quantity: { type: DataTypes.INTEGER },
      categoryId: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'catId' } },
      storeId: { type: DataTypes.INTEGER, references: { model: 'Stores', key: 'storeId' } },
      soldDate: { type: DataTypes.DATE }
    });
  
    SalesRecord.associate = (models) => {
      SalesRecord.belongsTo(models.User, { foreignKey: 'userId' });
      SalesRecord.belongsTo(models.Product, { foreignKey: 'productId' });
      SalesRecord.belongsTo(models.Category, { foreignKey: 'categoryId' });
      SalesRecord.belongsTo(models.Store, { foreignKey: 'storeId' });
    };
  
    return SalesRecord;
  };
  