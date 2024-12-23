const { custom } = require("joi");

module.exports = (sequelize, DataTypes) => {
  const SalesRecord = sequelize.define('SalesRecord', {
    saleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'userId' },
    },
    productId: {
      type: DataTypes.UUID,
      references: { model: 'Products', key: 'prodId' },
    },
    paymentOption: {
      type: DataTypes.ENUM('full', 'part_payment', 'credit'),
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'POS', 'transfer','credit' ),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    currentPayment: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: { model: 'Categories', key: 'catId' },
    },
    storeId: {
      type: DataTypes.UUID,
      references: { model: 'Stores', key: 'storeId' },

    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productPrice: { 
      type: DataTypes.DECIMAL(10, 2),
    },
    soldDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  SalesRecord.associate = (models) => {
    SalesRecord.belongsTo(models.User, { foreignKey: 'userId' });
    SalesRecord.belongsTo(models.Product, { foreignKey: 'productId' });
    SalesRecord.belongsTo(models.Category, { foreignKey: 'categoryId' });
    SalesRecord.belongsTo(models.Store, { foreignKey: 'storeId' });
  };

  return SalesRecord;
};
