import db from "../dbConfig.js";
import { DataTypes } from "sequelize";

const Deliverable = db.define("Deliverable", {
  DeliverableID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ProjectID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  DueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  VideoLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  DeploymentLink: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Deliverable;
