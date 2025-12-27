import { useState } from "react";
import { useParams } from "react-router-dom";
import "../components-css/ProjectForm.css";
import API_URL from "../api";

const ProjectForm = ({ onSubmit, onCancel }) => {
  const { userId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [deploymentLink, setDeploymentLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const projectRes = await fetch(`${API_URL}/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: title,
          Description: description,
          VideoLink: videoLink,
          DeploymentLink: deploymentLink,
        }),
      });

      const project = await projectRes.json();

      await fetch(`${API_URL}/userProjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          projectId: project.ProjectID,
        }),
      });

      onSubmit(project);
    } catch (err) {
      console.error("Project creation failed:", err);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="Video Link" />
      <input value={deploymentLink} onChange={(e) => setDeploymentLink(e.target.value)} placeholder="Deployment Link" />
      <button type="submit">Add Project</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default ProjectForm;
