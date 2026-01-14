import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components-css/GiveGrades.css";
import API_URL from "../api";

const GiveGrades = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/gradeable-projects/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch gradeable projects");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array, got:", data);
        }
      } catch (error) {
        console.error("Fetching gradeable projects failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const goToProjects = () => {
    navigate(`/projects/${userId}`);
  };

  const navigateToDeliverablesGrade = (projectId) => {
    navigate(`/deliverables-grade/${userId}/${projectId}`);
  };

  return (
    <div className="projects-container">
      {loading ? (
        <p>Loading...</p>
      ) : projects.length ? (
        <div className="projects-list">
          {projects.map((project) => (
            <div
              className="project-card"
              key={project.ProjectID}
              onClick={() => navigateToDeliverablesGrade(project.ProjectID)}
            >
              <h2>{project.Title}</h2>
              <p>{project.Description}</p>

              {project.VideoLink && (
                <a
                  href={project.VideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Video Link
                </a>
              )}

              {project.DeploymentLink && (
                <a
                  href={project.DeploymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Deployment Link
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available for grading.</p>
      )}

      <button id="giveGrades" onClick={goToProjects}>
        Back to Projects
      </button>
    </div>
  );
};

export default GiveGrades;
