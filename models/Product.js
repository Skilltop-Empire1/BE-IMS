module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    prodId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER },
    itemCode: { type: DataTypes.STRING },
    prodPhoto: { type: DataTypes.STRING, allowNull: false },
    // alertStatus: {
    //   type: DataTypes.ENUM('active', 'low', 'sold out'),
    //   allowNull: false,
    //   defaultValue: 'active',
    // },
    alertStatus:{type:DataTypes.INTEGER,allowNull:false,defaultValue: 60},
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: 'Categories', key: 'catId' },
    },
    storeId: {
      type: DataTypes.INTEGER,
      references: { model: 'Stores', key: 'storeId' },
    },
    storeAvailable: { type: DataTypes.STRING },
    prodDate: { type: DataTypes.DATE },
  });

  // Associations
  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.belongsTo(models.Store, { foreignKey: 'storeId' });
    Product.hasMany(models.SalesRecord, { foreignKey: 'productId' });
  };

  // Hook to update alertStatus on quantity changes (before save or update)
  // Product.addHook('beforeSave', (product) => {
  //   if (product.quantity === 0) {
  //     product.alertStatus = 'sold out';
  //   } else if (product.quantity <= 10) {
  //     product.alertStatus = 'low';
  //   } else {
  //     product.alertStatus = 'active';
  //   }
  // });

  // add notification hook
  Product.addHook('afterUpdate',async (product,options) =>{
    if(product.quantity <= product.alertStatus){
        // Emit an event to notify connected users
    io.emit('productAlert', {
      message: `The quantity of ${product.name} is low (Current: ${product.quantity})`,
      productId: product.prodId,
    });
      await sequelize.models.Notification.create({
        message:`The quantity of ${product.name} is low (Current: ${product.quantity})`,
        type:'product',
        userId:req.user.userId
      })
    }
  })
  return Product;
};

