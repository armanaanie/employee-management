export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};

export const canManageEmployees = (role) => role === ROLES.ADMIN;

export const canEditOwnProfile = (role) =>
  Boolean(role) && [ROLES.ADMIN, ROLES.EMPLOYEE].includes(role);
