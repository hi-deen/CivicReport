import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const points = (reports || []).map(r => {
      const [lng, lat] = r.location.coordinates;
      // optionally weight by severity if available: r.data.weight
      return [lat, lng, 0.6];
    });

    const layer = L.heatLayer(points, { radius: 25, blur: 15 });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, reports]);

  return null;
}
