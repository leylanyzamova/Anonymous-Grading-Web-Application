import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components-css/DeliverablesGrades.css";
import API_URL from "../api";

const DeliverablesGrades = () => {
  const { userId, projectID } = useParams();

  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  const [grade, setGrade] = useState(1.0);
  const [gradesData, setGradesData] = useState([]);
  const [gradedDeliverableIds, setGradedDeliverableIds] = useState([]);
  const [isEditingGrade, setIsEditingGrade] = useState(false);

  const navigate = useNavigate();

  // ===============================
  // EDIT GRADE
  // ===============================
  const handleGradeEditClick = async (deliverable) => {
    try {
      const deadlineRes = await fetch(
        `${API_URL}/api/permissions/deadline/${userId}/${projectID}`
      );
      const { GradeModificationDeadline } = await deadlineRes.json();

      const deadline = new Date(GradeModificationDeadline);
      const now = new Date();

      const hasGradedRes = await fetch(
        `${API_URL}/api/hasGraded?userId=${userId}&deliverableId=${deliverable.DeliverableID}`
      );
      const { hasGraded } = await hasGradedRes.json();

      if (hasGraded && now < deadline) {
        setSelectedDeliverable(deliverable);
        setIsEditingGrade(true);
        setShowGradeModal(true);
      } else {
        alert("You cannot edit the grade for this deliverable.");
      }
    } catch (err) {
      console.error("Grade edit error:", err);
    }
  };

  // ===============================
  // UPDATE GRADE
  // ===============================
  const handleGradeUpdate = async (e) => {
    e.preventDefault();

    const gradeValue = parseFloat(grade);
    if (gradeValue < 1 || gradeValue > 10) {
      alert("Grade must be between 1 and 10");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/grade/${userId}/${selectedDeliverable.DeliverableID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            GradeValue: gradeValue,
            GradeDate: new Date().toISOString(),
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      resetModal();
      fetchGrades();
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // ADD GRADE
  // ===============================
  const handleGradeSubmit = async (e) => {
    e.preventDefault();

    const gradeValue = parseFloat(grade);
    if (gradeValue < 1 || gradeValue > 10) {
      alert("Grade must be between 1 and 10");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userId,
          DeliverableID: selectedDeliverable.DeliverableID,
          GradeValue: gradeValue,
          GradeDate: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Submit failed");

      resetModal();
      fetchGrades();
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchGrades = async () => {
    const res = await fetch(`${API_URL}/api/grades`);
    const data = await res.json();
    setGradesData(data);

    const gradedIds = data
      .filter((g) => g.UserID === Number(userId))
      .map((g) => g.DeliverableID);

    setGradedDeliverableIds(gradedIds);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [delivRes, gradesRes] = await Promise.all([
          fetch(`${API_URL}/api/deliverables/${projectID}`),
          fetch(`${API_URL}/api/grades`),
        ]);

        const deliverablesData = await delivRes.json();
        const gradesData = await gradesRes.json();

        const gradedIds = gradesData
          .filter((g) => g.UserID === Number(userId))
          .map((g) => g.DeliverableID);

        setGradedDeliverableIds(gradedIds);

        setDeliverables(
          deliverablesData.map((d) => ({
            ...d,
            hasGraded: gradedIds.includes(d.DeliverableID),
          }))
        );

        setGradesData(gradesData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectID, userId]);

  const resetModal = () => {
    setShowGradeModal(false);
    setIsEditingGrade(false);
    setSelectedDeliverable(null);
    setGrade(1.0);
  };

  return (
    <div className="deliverables-container">
      {loading ? (
        <p>Loading...</p>
      ) : deliverables.length ? (
        <div className="deliverables-list">
          {deliverables.map((d) => (
            <div key={d.DeliverableID} className="deliverable-card">
              <h2>{d.Title}</h2>
              <p>{d.Description}</p>
              <p>{new Date(d.DueDate).toLocaleDateString()}</p>

              <button onClick={() => handleGradeEditClick(d)}>
                Edit Grade
              </button>
              <button
                onClick={() => {
                  setSelectedDeliverable(d);
                  setShowGradeModal(true);
                }}
              >
                Add Grade
              </button>
            </div>
          ))}

          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <button onClick={() => navigate(-1)}>No deliverables, Go Back</button>
      )}

      {showGradeModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={resetModal}>
              &times;
            </span>
            <h2>{selectedDeliverable?.Title}</h2>
            <form onSubmit={isEditingGrade ? handleGradeUpdate : handleGradeSubmit}>
              <input
                type="number"
                min="1"
                max="10"
                step="0.01"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <button type="submit">
                {isEditingGrade ? "Update Grade" : "Submit Grade"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverablesGrades;
