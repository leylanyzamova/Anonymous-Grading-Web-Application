import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
  getProjectsUserCanGrade,
} from "../DataAccess/ProjectsDA.js";

const projectRouter = express.Router();

/* ======================
   CREATE PROJECT
====================== */
projectRouter.post("/project", async (req, res) => {
  try {
    const project = await createProject(req.body);
    return res.status(201).json(project);
  } catch (err) {
    console.error("POST /project failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ======================
   GET ALL PROJECTS
====================== */
projectRouter.get("/projects", async (req, res) => {
  try {
    const projects = await getProjects();
    return res.json(projects);
  } catch (err) {
    console.error("GET /projects failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ======================
   GET PROJECT BY ID
====================== */
projectRouter.get("/project/:id", async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.json(project);
  } catch (err) {
    console.error("GET /project/:id failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ======================
   DELETE PROJECT
====================== */
projectRouter.delete("/project/:id", async (req, res) => {
  try {
    await deleteProject(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE /project/:id failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ======================
   UPDATE PROJECT
====================== */
projectRouter.put("/project/:id", async (req, res) => {
  try {
    const ret = await updateProject(req.params.id, req.body);
    if (ret.error) {
      return res.status(400).json({ error: true, msg: ret.msg });
    }
    return res.status(200).json(ret.obj);
  } catch (err) {
    console.error("PUT /project/:id failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ======================
   GRADEABLE PROJECTS
====================== */
projectRouter.get("/gradeable-projects/:userId", async (req, res) => {
  try {
    const projects = await getProjectsUserCanGrade(req.params.userId);
    return res.json(projects);
  } catch (err) {
    console.error("GET /gradeable-projects failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default projectRouter;
