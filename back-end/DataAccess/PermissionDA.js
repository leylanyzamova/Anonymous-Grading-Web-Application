import Permission from "../entities/Permissions.js";

/**
 * Get all permissions
 */
async function getPermissions() {
  return await Permission.findAll();
}

/**
 * Get permission by primary key
 */
async function getPermissionById(id) {
  return await Permission.findByPk(id);
}

/**
 * Get all permissions of a user
 */
async function getUserPermission(userId) {
  return await Permission.findAll({
    where: { UserID: userId },
  });
}

/**
 * Get permission of a user for a specific DELIVERABLE
 * (this is what grading must use)
 */
async function getUserDeliverablePermission(userId, deliverableId) {
  return await Permission.findOne({
    where: {
      UserID: userId,
      DeliverableID: deliverableId,
    },
  });
}

/**
 * Create a new permission
 */
async function createPermission(permission) {
  return await Permission.create(permission);
}

/**
 * Delete permission by ID
 */
async function deletePermission(id) {
  const permission = await Permission.findByPk(id);
  if (!permission) {
    return { error: true, msg: "No entity found" };
  }
  await permission.destroy();
  return { error: false, msg: "Permission deleted successfully" };
}

/**
 * Update permission
 */
async function updatePermission(id, permission) {
  try {
    let perm = await getPermissionById(id);
    if (!perm) return { error: true, msg: "No entity found" };

    await perm.update(permission);
    perm = await getPermissionById(id);

    return {
      error: false,
      msg: "Permission updated successfully",
      obj: perm,
    };
  } catch (error) {
    return { error: true, msg: "Error updating permission" };
  }
}

/**
 * Get grade modification deadline for a user & deliverable
 */
async function getGradeModificationDeadline(userId, deliverableId) {
  const permission = await Permission.findOne({
    where: {
      UserID: userId,
      DeliverableID: deliverableId,
    },
  });

  return permission ? permission.GradeModificationDeadline : null;
}

export {
  getPermissions,
  getPermissionById,
  getUserPermission,
  getUserDeliverablePermission,
  createPermission,
  deletePermission,
  updatePermission,
  getGradeModificationDeadline,
};
