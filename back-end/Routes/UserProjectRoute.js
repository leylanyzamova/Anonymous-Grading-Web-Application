import express from "express";
import {
  getUserProjects,
  getUserProjectsByUserId,
  setUserProject,
} from "../DataAccess/UserProjectDA.js";

const userProjectRouter = express.Router();

/* =========================
   GET ALL USER–PROJECT LINKS
========================= */
userProjectRouter.get("/userProjects", async (req, res) => {
  try {
    const data = await getUserProjects();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   CREATE USER–PROJECT LINK
   (USED WHEN STUDENT ADDS PROJECT)
========================= */
userProjectRouter.post("/userProjects", async (req, res) => {
  try {
    const { UserID, ProjectID } = req.body;

    if (!UserID || !ProjectID) {
      return res
        .status(400)
        .json({ error: "UserID and ProjectID are required" });
    }

    await setUserProject(UserID, ProjectID);

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating user-project relation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/* =========================
   GET PROJECTS OF A USER
   (USED IN ProjectsPage.js)
========================= */
userProjectRouter.get("/userProjects/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userWithProjects = await getUserProjectsByUserId(userId);

    if (!userWithProjects) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userWithProjects.Projects);
  } catch (error) {
    console.error("Failed to get user projects:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default userProjectRouter;
