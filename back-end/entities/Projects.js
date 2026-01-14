import db from "../dbConfig.js";
import Sequelize from "sequelize";

const Project = db.define("Project", {
  ProjectID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  Title: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  Description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  VideoLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  DeploymentLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  // ✅ MUST BE FLOAT
  FinalGrade: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
});

export default Project;
