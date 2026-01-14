import Deliverable from "../entities/Deliverable.js";

/* ======================
   GET ALL DELIVERABLES
====================== */
async function getDeliverables() {
  return await Deliverable.findAll({
    include: ["Grades"],
  });
}

/* ======================
   GET BY PROJECT ID
====================== */
async function getDeliverablesByProjectID(ProjectID) {
  return await Deliverable.findAll({
    where: { ProjectID },
    include: ["Grades"],
  });
}

/* ======================
   GET ONE
====================== */
async function getDeliverableById(id) {
  return await Deliverable.findByPk(id, {
    include: ["Grades"],
  });
}

/* ======================
   CREATE
====================== */
async function createDeliverable(deliverable) {
  return await Deliverable.create(deliverable);
}

/* ======================
   CREATE WITH PROJECT ID
====================== */
async function createDeliverableWithProjId(deliverable, ProjectID) {
  return await Deliverable.create({
    ...deliverable,
    ProjectID,
  });
}

/* ======================
   UPDATE
====================== */
async function updateDeliverable(id, deliverable) {
  const existing = await Deliverable.findByPk(id);
  if (!existing) {
    return { error: true, msg: "Deliverable not found" };
  }

  await existing.update(deliverable);
  return {
    error: false,
    obj: existing,
  };
}

/* ======================
   DELETE
====================== */
async function deleteDeliverable(id) {
  const deliverable = await Deliverable.findByPk(id);
  if (!deliverable) {
    return { error: true, msg: "Deliverable not found" };
  }

  await deliverable.destroy();
  return { error: false };
}

export {
  getDeliverables,
  getDeliverableById,
  getDeliverablesByProjectID,
  createDeliverable,
  createDeliverableWithProjId,
  updateDeliverable,
  deleteDeliverable,
};
