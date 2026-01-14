import Project from "../entities/Projects.js";
import User from "../entities/Users.js";
import Permission from "../entities/Permissions.js";

async function getProjects() {
  return await Project.findAll({ include: User });
}

async function getProjectById(id) {
  return await Project.findByPk(id, { include: User });
}

async function createProject(project) {
  return await Project.create(project);
}

async function deleteProject(id) {
  const project = await Project.findByPk(id);
  if (!project) return null;
  return await project.destroy();
}

async function updateProject(id, data) {
  const project = await Project.findByPk(id);
  if (!project) return { error: true };
  await project.update(data);
  return { error: false, obj: project };
}

async function getProjectsUserCanGrade(userId) {
  const permissions = await Permission.findAll({
    where: { UserID: userId, CanGrade: true },
    include: Project,
  });
  return permissions.map(p => p.Project);
}

export {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
  getProjectsUserCanGrade,
};
