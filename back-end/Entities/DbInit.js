import User from "./Users.js";
import Deliverable from "../entities/deliverable.js";
import Grade from "./Grades.js";
import Permission from "./Permissions.js";
import Project from "./Projects.js";

/**
 * Configure model relationships and sync database
 * (SQLite / Sequelize compatible – Render-safe)
 */
function FK_Config() {
  User.belongsToMany(Project, {
    as: "Projects",
    through: "UserProjects",
    foreignKey: "UserID"
  });

  Project.belongsToMany(User, {
    as: "User",
    through: "UserProjects",
    foreignKey: "ProjectID"
  });

  Project.hasMany(Deliverable, {
    as: "Deliverables",
    foreignKey: "ProjectID"
  });
  Deliverable.belongsTo(Project, {
    as: "Project",
    foreignKey: "ProjectID"
  });

  User.hasMany(Grade, {
    as: "Grades",
    foreignKey: "UserID"
  });
  Grade.belongsTo(User, {
    as: "User",
    foreignKey: "UserID"
  });

  Deliverable.hasMany(Grade, {
    as: "Grades",
    foreignKey: "DeliverableID"
  });
  Grade.belongsTo(Deliverable, {
    as: "Deliverable",
    foreignKey: "DeliverableID"
  });

  User.hasMany(Permission, {
    as: "Permissions",
    foreignKey: "UserID"
  });
  Permission.belongsTo(User, {
    as: "User",
    foreignKey: "UserID"
  });

  Project.hasMany(Permission, {
    as: "Permissions",
    foreignKey: "ProjectID"
  });
  Permission.belongsTo(Project, {
    as: "Project",
    foreignKey: "ProjectID"
  });
}

export default function DB_Init() {
  FK_Config();
  console.log("Database relations configured");
}
