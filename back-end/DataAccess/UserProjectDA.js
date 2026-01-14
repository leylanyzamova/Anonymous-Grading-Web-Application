import User from "../entities/Users.js";
import Project from "../entities/Projects.js";

async function setUserProject(userId, projectId) {
  const user = await User.findByPk(userId);
  const project = await Project.findByPk(projectId);
  if (!user || !project) throw new Error("Invalid IDs");
  await user.addProject(project);
}

async function getUserProjectsByUserId(userId) {
  return await User.findByPk(userId, {
    include: Project,
  });
}

export {
  setUserProject,
  getUserProjectsByUserId,
};
