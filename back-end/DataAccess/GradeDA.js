import Grade from "../entities/Grades.js";
import Deliverable from "../entities/Deliverable.js";
import Project from "../entities/Projects.js";

/* ================= BASIC CRUD ================= */

async function getGrades() {
  return await Grade.findAll({
    include: ["User", "Deliverable"],
  });
}

async function getGradeById(id) {
  return await Grade.findByPk(id, {
    include: ["User", "Deliverable"],
  });
}

async function createGrade(grade) {
  return await Grade.create(grade);
}

async function deleteGrade(id) {
  const grade = await Grade.findByPk(id);
  if (!grade) {
    return { error: true, msg: "Grade not found" };
  }

  await grade.destroy();
  return { error: false };
}

async function updateGrade(id, gradeData) {
  const grade = await Grade.findByPk(id);
  if (!grade) {
    return { error: true, msg: "Grade not found" };
  }

  await grade.update(gradeData);
  return {
    error: false,
    obj: grade,
  };
}

/* ================= DELIVERABLE-BASED ================= */

async function hasUserGradedDeliverable(UserID, DeliverableID) {
  const grade = await Grade.findOne({
    where: { UserID, DeliverableID },
  });
  return grade !== null;
}

async function getGradeByUserAndDeliverable(UserID, DeliverableID) {
  return await Grade.findOne({
    where: { UserID, DeliverableID },
  });
}

async function updateGradeByUserAndDeliverable(
  UserID,
  DeliverableID,
  newGradeData
) {
  const grade = await Grade.findOne({
    where: { UserID, DeliverableID },
  });

  if (!grade) {
    return { error: true, msg: "Grade not found" };
  }

  await grade.update(newGradeData);
  return {
    error: false,
    obj: grade,
  };
}

/* ================= FINAL PROJECT GRADE ================= */

async function calculateFinalProjectGrade(ProjectID) {
  const deliverables = await Deliverable.findAll({
    where: { ProjectID },
  });

  if (deliverables.length < 1) return null;

  const deliverableIds = deliverables.map(
    (d) => d.DeliverableID
  );

  const grades = await Grade.findAll({
    where: { DeliverableID: deliverableIds },
  });

  if (grades.length < 3) return null;

  let values = grades.map((g) =>
    parseFloat(g.GradeValue)
  );

  values.sort((a, b) => a - b);
  values.shift(); // remove lowest
  values.pop(); // remove highest

  if (values.length === 0) return null;

  const avg =
    values.reduce((sum, v) => sum + v, 0) / values.length;

  const finalGrade = Number(avg.toFixed(2));

  const project = await Project.findByPk(ProjectID);
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
