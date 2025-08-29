import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../styles/MapaDireccion.css";

// ícono por defecto para el marcador
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapaDireccionProps {
  lat: number;
  lng: number;
  ciudad: string;
  calle: string;
  referencia?: string;
}

const MapaDireccion: React.FC<MapaDireccionProps> = ({ lat, lng, ciudad, calle, referencia }) => {
  return (
    <div className="mapa-direccion">
    <div className="direccion-info">
        <h3>Dirección</h3>
        <p><strong>Ciudad:</strong> {ciudad}</p>
        <p><strong>Calle:</strong> {calle}</p>
        {referencia && <p><strong>Referencia:</strong> {referencia}</p>}
      </div>
      <div className="mapa-container">
        <MapContainer center={[lat, lng]} zoom={15} style={{ height: "200px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              {calle}, {ciudad}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

    </div>
  );
};

export default MapaDireccion;
