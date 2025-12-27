import express from "express";

import { assignJuryIfNeeded } from "../Services/JuryService.js";
import { getUserDeliverablePermission } from "../DataAccess/PermissionDA.js";

import Deliverable from "../Entities/Deliverables.js";

import {
  getGrades,
  getGradeById,
  createGrade,
  deleteGrade,
  hasUserGradedDeliverable,
  getGradeByUserAndDeliverable,
  updateGradeByUserAndDeliverable,
} from "../DataAccess/GradeDA.js";

const gradeRouter = express.Router();

/**
 * CREATE GRADE
 * - Jury assigned lazily if not already assigned
 * - Only jury members can grade
 */
gradeRouter.post("/grade", async (req, res) => {
  try {
    const { UserID, DeliverableID } = req.body;

    const deliverable = await Deliverable.findByPk(DeliverableID);
    if (!deliverable) {
      return res.status(404).json({ msg: "Deliverable not found" });
    }

    // Assign jury if not already assigned
    await assignJuryIfNeeded(DeliverableID);

    // Check deliverable-based permission
    const permission = await getUserDeliverablePermission(
      UserID,
      DeliverableID
    );

    if (!permission || !permission.CanGrade) {
      return res.status(403).json({ msg: "User is not allowed to grade" });
    }

    return res.status(201).json(await createGrade(req.body));
  } catch (err) {
    return res.status(500).json({ msg: "Error creating grade" });
  }
});

/**
 * GET ALL GRADES (professor/admin)
 */
gradeRouter.get("/grades", async (req, res) => {
  return res.json(await getGrades());
});

/**
 * GET GRADE BY ID
 */
gradeRouter.get("/grade/:id", async (req, res) => {
  return res.json(await getGradeById(req.params.id));
});

/**
 * CHECK IF USER HAS GRADED A DELIVERABLE
 */
gradeRouter.get("/hasGraded", async (req, res) => {
  try {
    const { userId, deliverableId } = req.query;
    const hasGraded = await hasUserGradedDeliverable(userId, deliverableId);
    res.json({ hasGraded });
  } catch {
    res.status(500).json({ msg: "Error checking grade status" });
  }
});

/**
 * GET GRADE BY USER + DELIVERABLE
 */
gradeRouter.get("/grade/:userId/:deliverableId", async (req, res) => {
  try {
    const { userId, deliverableId } = req.params;
    const grade = await getGradeByUserAndDeliverable(userId, deliverableId);

    if (!grade) {
      return res.status(404).json({ msg: "Grade not found" });
    }

    res.json(grade);
  } catch {
    res.status(500).json({ msg: "Error fetching grade" });
  }
});

/**
 * UPDATE GRADE
 * - Only the jury member who created it
 * - Only before modification deadline
 */
gradeRouter.put("/grade/:userId/:deliverableId", async (req, res) => {
  try {
    const { userId, deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) {
      return res.status(404).json({ msg: "Deliverable not found" });
    }

    const permission = await getUserDeliverablePermission(
      userId,
      deliverableId
    );

    if (!permission || !permission.CanModifyGrade) {
      return res.status(403).json({ msg: "Not allowed to modify grade" });
    }

    if (
      permission.GradeModificationDeadline &&
      new Date() > new Date(permission.GradeModificationDeadline)
    ) {
      return res
        .status(403)
        .json({ msg: "Grade modification deadline passed" });
    }

    const ret = await updateGradeByUserAndDeliverable(
      userId,
      deliverableId,
      req.body
    );

    if (ret.error) {
      return res.status(400).json({ msg: ret.msg });
    }

    return res.status(200).json(ret.obj);
  } catch {
    return res.status(500).json({ msg: "Error updating grade" });
  }
});

/**
 * DELETE GRADE
 */
gradeRouter.delete("/grade/:id", async (req, res) => {
  return res.json(await deleteGrade(req.params.id));
});

export default gradeRouter;
