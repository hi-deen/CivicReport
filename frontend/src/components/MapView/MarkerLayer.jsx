import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

export default function MarkerLayer({ reports }) {
  if (!reports || !reports.length) return null;
  return (
    <>
      {reports.map(r => {
        const [lng, lat] = r.location.coordinates;
        return (
          <Marker key={r._id} position={[lat, lng]}>
            <Popup>
              <strong>{r.reportType?.name || "Report"}</strong>
              <div>{r.data?.title || r.data?.crimeType || r.data?.description}</div>
              <small>{new Date(r.createdAt).toLocaleString()}</small>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
