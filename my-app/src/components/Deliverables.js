import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeliverableForm from "./DeliverableForm";
import "../components-css/Deliverables.css";
import API_URL from "../api";

const Deliverables = () => {
  const { projectID } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchDeliverables = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/deliverables/${projectID}`
      );
      const data = await response.json();
      setDeliverables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [projectID]);

  const handleNewDeliverableSubmit = async (formData) => {
    await fetch(`${API_URL}/api/deliverable/${projectID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    fetchDeliverables();
    setShowForm(false);
  };

  return (
    <div className="deliverables-container">
      {loading ? (
        <p>Loading...</p>
      ) : deliverables.length ? (
        <div className="deliverables-list">
          {deliverables.map((d) => (
            <div className="deliverable-card" key={d.DeliverableID}>
              <h2>{d.Title}</h2>
              <p>{d.Description}</p>
              <p>{new Date(d.DueDate).toLocaleDateString()}</p>
            </div>
          ))}
          <button onClick={() => setShowForm(true)}>Add Deliverable</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      ) : (
        <p>No deliverables found.</p>
      )}

      {showForm && (
        <DeliverableForm
          ProjectID={projectID}
          onSubmit={handleNewDeliverableSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Deliverables;
