import db from "../dbConfig.js";
import Sequelize from "sequelize";

const UserProject = db.define(
  "UserProjects",
  {
    UserID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ProjectID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

export default UserProject;
