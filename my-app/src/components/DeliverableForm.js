import React, { useState } from "react";
import "../components-css/DeliverableForm.css";
import API_URL from "../api";

const DeliverableForm = ({ onSubmit, onCancel, ProjectID }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/api/deliverable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Title: title,
        Description: description,
        DueDate: dueDate,
        ProjectID: Number(ProjectID),
      }),
    });

    onSubmit();
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit">Add</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default DeliverableForm;
