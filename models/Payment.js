
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      payId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
      },
      paymentProvider: {
        type: DataTypes.STRING, 
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paidDate:{
        type:DataTypes.DATEONLY,
        allowNull:true
      }
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.Code, { foreignKey: 'email', targetKey: 'email' });
    };
  
    return Payment;
  };