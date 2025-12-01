import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MarkerLayer from "./MarkerLayer";
import HeatmapLayer from "./HeatmapLayer";
import io from "socket.io-client";
import api from "../../api/api";

export default function MapView({ activeType }) {
  const [reports, setReports] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    if (!activeType) return;
    async function fetchReports() {
      const { data } = await api.get(`/reports?type=${activeType}`);
      setReports(data.reports || []);
    }
    fetchReports();

    // socket
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000");
      socketRef.current.on("report_verified", (payload) => {
        // add new verified report if it matches activeType
        setReports(prev => [payload.report, ...prev]);
      });
      socketRef.current.on("report_created", (payload) => {
        // optional: show pending indicator or notify admin only
      });
    }

    return () => {
      // don't close socket here so it survives layer toggles
    };
  }, [activeType]);

  return (
    <MapContainer center={[9.0820, 8.6753]} zoom={6} style={{ flex: 1 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerLayer reports={reports} />
      <HeatmapLayer reports={reports} />
    </MapContainer>
  );
}
