const rolesPermissions = {
    superAdmin: ['view', 'edit', 'create', 'approval'],
    admin: ['view', 'edit', 'create'],
    manager: ['view', 'edit', 'approval'],
    employee: ['view'],
    salesEmployee: ['view', 'create'],
    finance: ['view', 'approval'],
  };
  
  module.exports = rolesPermissions;
  