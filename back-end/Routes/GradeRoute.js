import express from "express";
import Deliverable from "../entities/Deliverable.js";
import {
  getGradeByUserAndDeliverable,
  createGrade
} from "../Services/GradeService.js";

const gradeRouter = express.Router();

/**
 * CREATE SELF GRADE
 * - Only the deliverable owner can self-grade
 * - Does NOT require jury assignment
 */
gradeRouter.post("/self-grade", async (req, res) => {
  try {
    const { UserID, DeliverableID } = req.body;

    const deliverable = await Deliverable.findByPk(DeliverableID);
    if (!deliverable) {
      return res.status(404).json({ msg: "Deliverable not found" });
    }

    // ownership check
    if (deliverable.OwnerUserID !== UserID) {
      return res
        .status(403)
        .json({ msg: "You can only self-grade your own deliverable" });
    }

    // Prevent duplicate self-grades
    const existing = await getGradeByUserAndDeliverable(
      UserID,
      DeliverableID
    );

    if (existing) {
      return res
        .status(400)
        .json({ msg: "Self-grade already exists" });
    }

    // Force grade type = SELF
    const gradeData = {
      ...req.body,
      GradeType: "SELF"
    };

    const grade = await createGrade(gradeData);
    return res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error creating self-grade" });
  }
});

export default gradeRouter;
