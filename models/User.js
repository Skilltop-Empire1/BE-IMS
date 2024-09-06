module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userName: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM('superAdmin', 'admin', 'manager', 'salesEmployee'),
        allowNull: false
      },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      userLogo: { type: DataTypes.INTEGER, references: { model: 'Profiles', key: 'profileId' } },
    });
  
    User.associate = (models) => {
      User.hasOne(models.Profile, { foreignKey: 'userId' });
      User.hasMany(models.SalesRecord, { foreignKey: 'userId' });
      User.hasMany(models.Store, { foreignKey: 'userId' });
    };
  
    return User;
  };
  