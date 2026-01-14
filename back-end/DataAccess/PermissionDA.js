import Permission from "../entities/Permissions.js";

/* ================= BASIC ================= */

async function getPermissions() {
  return await Permission.findAll({
    include: ["User", "Project"],
  });
}

async function getPermissionById(id) {
  return await Permission.findByPk(id, {
    include: ["User", "Project"],
  });
}

async function getUserPermission(UserID) {
  return await Permission.findAll({
    where: { UserID },
    include: ["Project"],
  });
}

/* ================= PROJECT-BASED (CORRECT) ================= */

/**
 * Get permission of a user for a PROJECT
 */
async function getUserProjectPermission(UserID, ProjectID) {
  return await Permission.findOne({
    where: { UserID, ProjectID },
  });
}

/**
 * Get grade modification deadline for user & project
 * (used by DeliverablesGrades.js)
 */
async function getGradeModificationDeadline(UserID, ProjectID) {
  const permission = await Permission.findOne({
    where: { UserID, ProjectID },
  });

  return permission
    ? permission.GradeModificationDeadline
    : null;
}

/* ================= MUTATIONS ================= */

async function createPermission(permission) {
  return await Permission.create(permission);
}

async function deletePermission(id) {
  const permission = await Permission.findByPk(id);
  if (!permission) {
    return { error: true, msg: "Permission not found" };
  }

  await permission.destroy();
  return { error: false };
}

async function updatePermission(id, permissionData) {
  const perm = await Permission.findByPk(id);
  if (!perm) {
    return { error: true, msg: "Permission not found" };
  }

  await perm.update(permissionData);
  return {
    error: false,
    obj: perm,
  };
}

export {
  getPermissions,
  getPermissionById,
  getUserPermission,
  getUserProjectPermission,
  createPermission,
  deletePermission,
  updatePermission,
  getGradeModificationDeadline,
};
