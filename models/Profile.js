module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
      profileId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'userId' }, unique: true },
      staffId: { type: DataTypes.UUID, references: { model: 'Staffs', key: 'staffId' }, unique: true },
      url: { type: DataTypes.STRING }
    });
  
    Profile.associate = (models) => {
      Profile.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Profile;
  };
  