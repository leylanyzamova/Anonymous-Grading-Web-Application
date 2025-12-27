import express from "express";
import {
  getDeliverables,
  getDeliverableById,
  getDeliverablesByProjectID,
  createDeliverable,
  createDeliverableWithProjId,
  deleteDeliverable,
  updateDeliverable,
} from "../DataAccess/DeliverableDA.js";
import { calculateFinalGrade } from "../Services/GradeSummaryService.js";

const deliverableRouter = express.Router();

deliverableRouter.get("/deliverables", async (req, res) => {
  res.json(await getDeliverables());
});

deliverableRouter.get("/deliverables/:projectID", async (req, res) => {
  res.json(await getDeliverablesByProjectID(req.params.projectID));
});

deliverableRouter.get("/deliverable/:id", async (req, res) => {
  res.json(await getDeliverableById(req.params.id));
});

deliverableRouter.post("/deliverable", async (req, res) => {
  res.status(201).json(await createDeliverable(req.body));
});

deliverableRouter.post("/deliverable/:projectID", async (req, res) => {
  res
    .status(201)
    .json(await createDeliverableWithProjId(req.body, req.params.projectID));
});

deliverableRouter.put("/deliverable/:id", async (req, res) => {
  const ret = await updateDeliverable(req.params.id, req.body);
  if (ret.error) return res.status(400).json(ret);
  res.json(ret.obj);
});

deliverableRouter.delete("/deliverable/:id", async (req, res) => {
  res.json(await deleteDeliverable(req.params.id));
});

/**
 * FINAL GRADE (trimmed mean)
 */
deliverableRouter.get("/deliverable/:id/summary", async (req, res) => {
  res.json(await calculateFinalGrade(req.params.id));
});

export default deliverableRouter;
