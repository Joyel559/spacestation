// Developed by John Joyel

import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

type LiveViewProps = {
  onClose: () => void;
};

const issIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg",
  iconSize: [40, 40],
});

const MoveISS = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const LiveView: React.FC<LiveViewProps> = ({ onClose }) => {
  const [issPosition, setIssPosition] = React.useState<LatLngExpression>([0, 0]);

  React.useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch("https://api.open-notify.org/iss-now.json");
        const data = await res.json();
        const lat = parseFloat(data.iss_position.latitude);
        const lng = parseFloat(data.iss_position.longitude);
        setIssPosition([lat, lng]);
      } catch (err) {
        console.error("Error fetching ISS position:", err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={issPosition}
        zoom={2}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={issPosition} icon={issIcon} />
        <MoveISS lat={issPosition[0]} lng={issPosition[1]} />
      </MapContainer>

      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 bg-black text-white px-4 py-2 rounded-md shadow-md"
      >
        ← Back
      </button>

      <p className="absolute bottom-4 w-full text-center text-white text-xs z-10">
        Developed by John Joyel
      </p>
    </div>
  );
};

export default LiveView;
