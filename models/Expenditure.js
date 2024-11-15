
module.exports = (sequelize, DataTypes) => {
    const Expenditure = sequelize.define('Expenditure', {
      expendId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('OPEX', 'CAPEX'),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true, // Only applicable for OPEX
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      annualDepreciation: {
        type: DataTypes.FLOAT,
        allowNull: true, // Only applicable for CAPEX
      },
      vendor: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for both OPEX and CAPEX
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateOfExpense: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      uploadReceipt: {
        type: DataTypes.STRING, // URL or path to the receipt
        allowNull: true,
      },
      expectedLifespan: {
        type: DataTypes.INTEGER, // Only applicable for CAPEX
        allowNull: true,
      },
    });

    Expenditure.associate = (models) =>{
        Expenditure.belongsTo(models.Store, {foreignKey: 'storeId'})
    }
  
    return Expenditure;
  };
  