const { type } = require("../validations/expenditureValidation");

module.exports = (sequelize, DataTypes) => {
    const Code = sequelize.define('Code', {
      payId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      businessName:{
        type:DataTypes.STRING,
        allowNull:true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      phone:{
        type:DataTypes.STRING,
        allowNull:true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentDate:{
        type:DataTypes.DATEONLY,
        allowNull:true
      },
      subType:{
        type:DataTypes.STRING,
        allowNull:false
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      generatedBy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'manual', 
      },
      sendEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, 
      },
      expiresAt: DataTypes.DATEONLY,
    });
  
    Code.associate = (models) => {
      Code.hasOne(models.Payment, { foreignKey: 'email', sourceKey: 'email' });
    }
  
    return Code;
  };