const fs = require('fs');
const file = '/home/kratos-financials-inc/Documents/kratos/site_web/apps/backend/src/middlewares/auth.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const isSuperAdmin = (role) => SUPER_ADMIN_ROLES.includes(role);',
  `const isSuperAdmin = (role) => {
  if (!role) return false;
  return SUPER_ADMIN_ROLES.includes(role) || role.toLowerCase().includes('super-admin');
};`
);

content = content.replace(
  'const isAdmin = (role) => ADMIN_ROLES.includes(role);',
  `const isAdmin = (role) => {
  if (!role) return false;
  return isSuperAdmin(role) || ADMIN_ROLES.includes(role) || role.toLowerCase().includes('admin');
};`
);

content = content.replace(
  'const isManager = (role) => MANAGER_ROLES.includes(role);',
  `const isManager = (role) => {
  if (!role) return false;
  return isAdmin(role) || MANAGER_ROLES.includes(role) || role.toLowerCase().includes('responsable');
};`
);

fs.writeFileSync(file, content);
console.log("Patched auth.js");
