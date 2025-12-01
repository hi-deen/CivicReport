import React, { useEffect, useState } from "react";
import MapView from "./components/MapView/MapView";
import TogglePanel from "./components/Sidebar/TogglePanel";
import api from "./api/api";

export default function App() {
  const [types, setTypes] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    async function loadTypes() {
      const { data } = await api.get("/report-types");
      setTypes(data.types);
      if (data.types.length > 0) setActive(data.types[0].slug);
    }
    loadTypes();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <TogglePanel types={types} active={active} setActive={setActive} />
      <MapView activeType={active} />
    </div>
  );
}
