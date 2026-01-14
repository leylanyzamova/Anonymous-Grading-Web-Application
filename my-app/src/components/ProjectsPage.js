import "../components-css/ProjectsPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProjectForm from "./ProjectFrom";
import API_URL from "../api";

const ProjectsPage = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const navigate = useNavigate();

  const userType = localStorage.getItem("UserType");

  const calculateAverageGrade = (grades) => {
    if (!grades || grades.length <= 2) return "Not graded";
    const sorted = [...grades].sort((a, b) => a - b);
    sorted.pop();
    sorted.shift();
    const sum = sorted.reduce((a, b) => a + b, 0);
    return (sum / sorted.length).toFixed(2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsUrl =
          userType === "professor"
            ? `${API_URL}/api/projects`
            : `${API_URL}/api/userProjects/${userId}`;

        const [projectsRes, deliverablesRes] = await Promise.all([
          fetch(projectsUrl),
          fetch(`${API_URL}/api/deliverables`)
        ]);

        if (!projectsRes.ok || !deliverablesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const projectsData = await projectsRes.json();
        const deliverablesData = await deliverablesRes.json();

        const gradeMap = {};
        deliverablesData.forEach((d) => {
          if (!gradeMap[d.ProjectID]) gradeMap[d.ProjectID] = [];
          if (d.Grades && Array.isArray(d.Grades)) {
            gradeMap[d.ProjectID].push(
              ...d.Grades.map((g) => parseFloat(g.GradeValue))
            );
          }
        });

        const finalProjects = projectsData.map((p) => ({
          ...p,
          FinalGrade: calculateAverageGrade(
            gradeMap[p.ProjectID] || []
          ),
        }));

        setProjects(finalProjects);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchData();
  }, [userId, projectSubmitted, userType]);

  return (
    <div className="projects-container">
      <div className="projects-list">
        {projects.map((project) => (
          <div
            key={project.ProjectID}
            className="project-card"
            onClick={() =>
              userType !== "professor" &&
              navigate(`/deliverables/${project.ProjectID}`)
            }
          >
            <h2>{project.Title}</h2>
            <p>{project.Description}</p>
            <a href={project.VideoLink} target="_blank" rel="noreferrer">
              Video
            </a>
            <br />
            <a href={project.DeploymentLink} target="_blank" rel="noreferrer">
              Deployment
            </a>

            {userType === "professor" && (
              <h3>Final Grade: {project.FinalGrade}</h3>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <ProjectForm
          onSubmit={() => {
            setProjectSubmitted(!projectSubmitted);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {userType !== "professor" && (
        <div className="butoane">
          <button onClick={() => setShowForm(true)}>
            Add New Project
          </button>
          <button onClick={() => navigate(`/give-grades/${userId}`)}>
            Grade colleagues
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
