import express from "express";
import {
  getGrades,
  createGrade,
  deleteGrade,
  updateGrade,
  hasUserGradedDeliverable,
  updateGradeByUserAndDeliverable,
} from "../DataAccess/GradeDA.js";

const gradeRouter = express.Router();

// GET all grades
gradeRouter.get("/grades", async (req, res) => {
  res.json(await getGrades());
});

// CREATE grade
gradeRouter.post("/grade", async (req, res) => {
  res.status(201).json(await createGrade(req.body));
});

// UPDATE grade by ID
gradeRouter.put("/grade/:id", async (req, res) => {
  const ret = await updateGrade(req.params.id, req.body);
  if (ret.error) return res.status(400).json(ret);
  res.json(ret.obj);
});

// UPDATE grade by user + deliverable
gradeRouter.put("/grade/:userId/:deliverableId", async (req, res) => {
  const ret = await updateGradeByUserAndDeliverable(
    req.params.userId,
    req.params.deliverableId,
    req.body
  );
  if (ret.error) return res.status(400).json(ret);
  res.json(ret.obj);
});

// CHECK if user has graded deliverable
gradeRouter.get("/hasGraded", async (req, res) => {
  const { userId, deliverableId } = req.query;
  const hasGraded = await hasUserGradedDeliverable(userId, deliverableId);
  res.json({ hasGraded });
});

export default gradeRouter;
