import User from "../entities/Users.js";
import Project from "../entities/Projects.js";

async function getUsers() {
  return await User.findAll({
    include: Project,
  });
}

async function getUserById(id) {
  return await User.findByPk(id, {
    include: Project,
  });
}

async function createUser(user) {
  return await User.create(user);
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.destroy();
}

async function updateUser(id, userData) {
  const user = await User.findByPk(id);
  if (!user) return { error: true };
  await user.update(userData);
  return { error: false, obj: user };
}

export {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};
