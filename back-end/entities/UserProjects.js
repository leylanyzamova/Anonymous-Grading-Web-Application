import db from "../dbConfig.js";
import Sequelize from "sequelize";

const UserProject = db.define("UserProjects", {
  UserProjectID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ProjectID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default UserProject;
