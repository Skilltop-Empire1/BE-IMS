module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      prodId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.INTEGER },
      itemCode: { type: DataTypes.STRING },
      prodPhoto: { type: DataTypes.STRING, allowNull: false },
      alertStatus: {
        type: DataTypes.ENUM('active', 'low-10', 'sold out-0'),
        allowNull: false
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'catId' } },
      storeId: { type: DataTypes.INTEGER, references: { model: 'Stores', key: 'storeId' } },
      storeAvailable: { type: DataTypes.ENUM('storeA', 'storeB', 'storeC') },
      prodDate: { type: DataTypes.DATE }
    });
  
    Product.associate = (models) => {
      Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Product.belongsTo(models.Store, { foreignKey: 'storeId' });
      Product.hasMany(models.SalesRecord, { foreignKey: 'productId' });
    };
  
    return Product;
  };
  