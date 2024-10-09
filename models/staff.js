module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define('Staff', {
    staffId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'userId' },
    },
    username: { 
      type: DataTypes.STRING(100), 
      allowNull: true 
    },
    email: { 
      type: DataTypes.STRING(100), 
      allowNull: false,
      unique: true 
    },
    password: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'terminated'),
      allowNull: false,
      defaultValue: 'active',
    },
    role:  {
      type: DataTypes.ENUM("Manager", "SuperAdmin", "Sales", "Employee", "Admin", "Finance"),
      allowNull: false,
      defaultValue: 'Employee',
    },
    storeId: {
      type: DataTypes.UUID,
      references: { model: 'Stores', key: 'storeId' },
    },
    addedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [
        {
          label: 'Store',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
        {
          label: 'Products',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
        {
          label: 'Users',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
        {
          label: 'Settings',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
        {
          label: 'Sales Records',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
        {
          label: 'Accounts',
          view: false,
          create: false,
          edit: false,
          approval: false,
        },
      ],
    },
  });

  Staff.associate = (models) => {
    Staff.hasOne(models.Profile, { foreignKey: "staffId" });
    Staff.belongsTo(models.Store, { foreignKey: 'storeId' });
    Staff.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Staff;
};
