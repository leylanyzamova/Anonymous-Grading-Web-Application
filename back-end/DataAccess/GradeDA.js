import Grade from "../entities/Grades.js";
import Deliverable from "../entities/Deliverables.js";
import Project from "../entities/Projects.js";

/* ================= BASIC CRUD ================= */

async function getGrades() {
  return await Grade.findAll();
}

async function getGradeById(id) {
  return await Grade.findByPk(id);
}

async function createGrade(grade) {
  return await Grade.create(grade);
}

async function deleteGrade(id) {
  const grade = await Grade.findByPk(id);
  return await grade.destroy();
}

async function updateGrade(id, grade) {
  try {
    let updateGrade = await getGradeById(id);
    if (!updateGrade) return { error: true, msg: "No entity found" };

    await updateGrade.update(grade);
    updateGrade = await getGradeById(id);

    return {
      error: false,
      msg: "Grade updated successfully",
      obj: updateGrade,
    };
  } catch {
    return { error: true, msg: "Error updating grade" };
  }
}

/* ================= DELIVERABLE-BASED ================= */

async function hasUserGradedDeliverable(userId, deliverableId) {
  const grade = await Grade.findOne({
    where: {
      UserID: userId,
      DeliverableID: deliverableId,
    },
  });
  return grade !== null;
}

async function getGradeByUserAndDeliverable(userId, deliverableId) {
  return await Grade.findOne({
    where: {
      UserID: userId,
      DeliverableID: deliverableId,
    },
  });
}

async function updateGradeByUserAndDeliverable(
  userId,
  deliverableId,
  newGradeData
) {
  try {
    const grade = await Grade.findOne({
      where: {
        UserID: userId,
        DeliverableID: deliverableId,
      },
    });

    if (!grade) {
      return { error: true, msg: "Grade not found" };
    }

    await grade.update(newGradeData);

    return {
      error: false,
      msg: "Grade updated successfully",
      obj: grade,
    };
  } catch {
    return { error: true, msg: "Error updating grade" };
  }
}

/* ================= FINAL PROJECT GRADE ================= */

/**
 * Calculates and saves the final project grade:
 * - collect all grades for all deliverables
 * - remove lowest and highest
 * - average remaining
 * - round to 2 decimals
 */
async function calculateFinalProjectGrade(projectId) {
  // 1. Get all deliverables of project
  const deliverables = await Deliverable.findAll({
    where: { ProjectID: projectId },
  });

  if (deliverables.length === 0) return null;

  const deliverableIds = deliverables.map(d => d.DeliverableID);

  // 2. Get all grades for those deliverables
  const grades = await Grade.findAll({
    where: {
      DeliverableID: deliverableIds,
    },
  });

  if (grades.length < 3) return null;

  // 3. Extract numeric values
  let values = grades.map(g => parseFloat(g.GradeValue));

  // 4. Sort and remove min & max
  values.sort((a, b) => a - b);
  values.shift(); // remove lowest
  values.pop();   // remove highest

  if (values.length === 0) return null;

  // 5. Average
  const avg =
    values.reduce((sum, v) => sum + v, 0) / values.length;

  const finalGrade = Number(avg.toFixed(2));

  // 6. Save to project
  const project = await Project.findByPk(projectId);
  if (!project) return null;

  await project.update({ FinalGrade: finalGrade });

  return finalGrade;
}

export {
  getGrades,
  getGradeById,
  createGrade,
  deleteGrade,
  updateGrade,
  hasUserGradedDeliverable,
  getGradeByUserAndDeliverable,
  updateGradeByUserAndDeliverable,
  calculateFinalProjectGrade,
};
