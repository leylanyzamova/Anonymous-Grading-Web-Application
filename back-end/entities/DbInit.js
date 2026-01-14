import sequelize from "./db.js";

// IMPORTANT: import ALL models so Sequelize registers tables
import User from "./Users.js";
import Project from "./Projects.js";
import Deliverable from "./Deliverable.js";
import Grade from "./Grades.js";
import Permission from "./Permissions.js";
import UserProject from "./UserProjects.js";

/**
 * Configure model relationships
 */
function FK_Config() {
  User.belongsToMany(Project, {
    through: UserProject,
    foreignKey: "UserID",
  });

  Project.belongsToMany(User, {
    through: UserProject,
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
}

export default async function DB_Init() {
  try {
    await sequelize.authenticate();
    FK_Config();

    // 🔥 THIS CREATES TABLES (FIXES "no such table: Users")
    await sequelize.sync({ alter: true });

    console.log("Database synced and relations configured");
  } catch (err) {
    console.error("DB INIT FAILED:", err);
    process.exit(1);
  }
}
