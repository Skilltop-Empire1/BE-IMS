module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
      profileId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: { type: DataTypes.UUID, references: { model: 'Users', key: 'userId' }, unique: true },
      staffId: { type: DataTypes.UUID, references: { model: 'Staffs', key: 'staffId' }, unique: true },
      url: { type: DataTypes.STRING }
    });
  
    Profile.associate = (models) => {
      Profile.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Profile;
  };
  