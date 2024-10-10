module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      catId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      storeId: { type: DataTypes.UUID, references: { model: 'Stores', key: 'storeId' } },
      name: { type: DataTypes.STRING, allowNull: false }
    });
  
    Category.associate = (models) => {
      Category.belongsTo(models.Store, { foreignKey: 'storeId' });
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    };
  
    return Category;
  };
  