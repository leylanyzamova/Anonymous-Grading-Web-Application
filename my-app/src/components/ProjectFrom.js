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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create project
      const projectRes = await fetch(`${API_URL}/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title: title,
          Description: description,
          VideoLink: videoLink,
          DeploymentLink: deploymentLink,
        }),
      });

      if (!projectRes.ok) {
        throw new Error("Failed to create project");
      }

      const project = await projectRes.json();

      // 2️⃣ Link project to user
      const linkRes = await fetch(`${API_URL}/api/userProjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: parseInt(userId),
          ProjectID: project.ProjectID,
        }),
      });

      if (!linkRes.ok) {
        throw new Error("Failed to assign project to user");
      }

      onSubmit(project);
    } catch (err) {
      console.error("Project creation failed:", err);
      alert("Project creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />

      <input
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        placeholder="Video Link"
      />

      <input
        value={deploymentLink}
        onChange={(e) => setDeploymentLink(e.target.value)}
        placeholder="Deployment Link"
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Project"}
      </button>

      <button type="button" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default ProjectForm;
