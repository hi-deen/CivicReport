import React from "react";

export default function TogglePanel({ types, active, setActive }) {
  return (
    <div style={{ width: 320, padding: 12, background: "#f7f7f8", overflowY: "auto" }}>
      <h3>Layers</h3>
      {types.map(t => (
        <div key={t._id} style={{ marginBottom: 8 }}>
          <label>
            <input
              type="radio"
              name="layer"
              checked={active === t.slug}
              onChange={() => setActive(t.slug)}
            />{" "}
            <strong style={{ color: t.color }}>{t.name}</strong>
          </label>
        </div>
      ))}
    </div>
  );
}
