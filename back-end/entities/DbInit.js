import sequelize from "../dbConfig.js";

import User from "./Users.js";
import Project from "./Projects.js";
import Deliverable from "./Deliverable.js"; // ⚠️ EXACT casing
import Grade from "./Grades.js";
import Permission from "./Permissions.js";
import UserProject from "./UserProjects.js";

async function FK_Config() {
  /* ======================
     USER ↔ PROJECT (M:N)
  ====================== */
  User.belongsToMany(Project, {
    through: UserProject,
    foreignKey: "UserID",
    otherKey: "ProjectID",
  });

  Project.belongsToMany(User, {
    through: UserProject,
    foreignKey: "ProjectID",
    otherKey: "UserID",
  });

  /* ======================
     PROJECT → DELIVERABLE
  ====================== */
  Project.hasMany(Deliverable, { foreignKey: "ProjectID" });
  Deliverable.belongsTo(Project, { foreignKey: "ProjectID" });

  /* ======================
     USER → GRADE
  ====================== */
  User.hasMany(Grade, { foreignKey: "UserID" });
  Grade.belongsTo(User, { foreignKey: "UserID" });

  /* ======================
     DELIVERABLE → GRADE
  ====================== */
  Deliverable.hasMany(Grade, { foreignKey: "DeliverableID" });
  Grade.belongsTo(Deliverable, { foreignKey: "DeliverableID" });

  /* ======================
     USER → PERMISSION
     DELIVERABLE → PERMISSION
  ====================== */
  User.hasMany(Permission, { foreignKey: "UserID" });
  Permission.belongsTo(User, { foreignKey: "UserID" });

  Deliverable.hasMany(Permission, { foreignKey: "DeliverableID" });
  Permission.belongsTo(Deliverable, { foreignKey: "DeliverableID" });

  /* ======================
     SYNC DATABASE
  ====================== */
  await sequelize.sync({ alter: true });

  console.log("Database synced and relations configured");
}

export default async function DB_Init() {
  await FK_Config();
}
