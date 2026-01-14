import sequelize from "../dbConfig.js";

import User from "./Users.js";
import Project from "./Projects.js";
import Deliverable from "./deliverable.js";
import Grade from "./Grades.js";
import Permission from "./Permissions.js";

async function FK_Config() {
  User.belongsToMany(Project, {
    through: "UserProjects",
    foreignKey: "UserID",
  });

  Project.belongsToMany(User, {
    through: "UserProjects",
    foreignKey: "ProjectID",
  });

  Project.hasMany(Deliverable, { foreignKey: "ProjectID" });
  Deliverable.belongsTo(Project, { foreignKey: "ProjectID" });

  User.hasMany(Grade, { foreignKey: "UserID" });
  Grade.belongsTo(User, { foreignKey: "UserID" });

  Deliverable.hasMany(Grade, { foreignKey: "DeliverableID" });
  Grade.belongsTo(Deliverable, { foreignKey: "DeliverableID" });

  User.hasMany(Permission, { foreignKey: "UserID" });
  Permission.belongsTo(User, { foreignKey: "UserID" });

  Project.hasMany(Permission, { foreignKey: "ProjectID" });
  Permission.belongsTo(Project, { foreignKey: "ProjectID" });

  // 🔥 THIS CREATES TABLES
  await sequelize.sync({ alter: true });

  console.log("Database synced and relations configured");
}

export default async function DB_Init() {
  await FK_Config();
}
