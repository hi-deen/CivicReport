import React, { useState } from "react";
import api from "../../api/api";

export default function DynamicForm({ type }) {
  const [form, setForm] = useState({});
  const [latlng, setLatlng] = useState({ lat: null, lng: null });

  const submit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("reportTypeSlug", type);
    payload.append("data", JSON.stringify(form));
    payload.append("lat", latlng.lat || "");
    payload.append("lng", latlng.lng || "");
    await api.post("/reports", payload, { headers: { "Content-Type": "multipart/form-data" } });
    alert("Report submitted");
  };

  return (
    <form onSubmit={submit}>
      {/* Implement dynamic fields from schema; simplified example: */}
      <div>
        <label>Description</label>
        <textarea onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} />
      </div>
      <div>
        <label>Latitude</label>
        <input onChange={(e) => setLatlng(prev => ({ ...prev, lat: e.target.value }))} />
      </div>
      <div>
        <label>Longitude</label>
        <input onChange={(e) => setLatlng(prev => ({ ...prev, lng: e.target.value }))} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
