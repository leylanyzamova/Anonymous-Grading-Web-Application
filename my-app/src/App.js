import LoginSignup from "./components/LoginSignup";
import ProjectsPage from "./components/ProjectsPage";
import GiveGrades from "./components/GiveGrades";
import Deliverables from "./components/Deliverables";
import DeliverablesGrade from "./components/DeliverablesGrade";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/projects/:userId" element={<ProjectsPage />} />
        <Route path="/give-grades/:userId" element={<GiveGrades />} />
        <Route path="/deliverables/:projectID" element={<Deliverables />} />
        <Route
          path="/deliverables-grade/:projectID"
          element={<DeliverablesGrade />}
        />
        <Route
          path="/deliverables-grade/:userId/:projectID"
          element={<DeliverablesGrade />}
        />
      </Routes>
    </Router>
  );
}

export default App;
