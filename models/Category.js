module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      catId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      storeId: { type: DataTypes.INTEGER, references: { model: 'Stores', key: 'storeId' } },
      name: { type: DataTypes.STRING, allowNull: false }
    });
  
    Category.associate = (models) => {
      Category.belongsTo(models.Store, { foreignKey: 'storeId' });
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    };
  
    return Category;
  };
  