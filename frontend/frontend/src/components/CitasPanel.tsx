// pages/Panel.tsx
import React, { useState, useEffect } from "react";
import CalendarioSemanal from "../components/CalendarioSemanal";
import MiniTarjeta from "../components/Minitarjeta";
import "../styles/Panel.css";
import { fetchConAuth } from "../utils/fetchConAuth";

const Panel: React.FC = () => {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetchConAuth("http://127.0.0.1:8000/api/agenda/listar_citas/")
      .then(res => res.json())
      .then(data => {
        setCitas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando citas...</div>;

  return (
    <div>

      
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {citas.map(cita => (
          <MiniTarjeta
            key={cita.id}
            nombre={cita.titulo}
            fecha={cita.fecha}
            estado={cita.estado}
            telefono={cita.telefono}
            email={cita.email}
            zoom={cita.enlace_zoom}
            descripcion={cita.descripcion_caso}
            servicio={cita.servicio}
            modalidad={cita.modalidad_valor}
            direccion={cita.direccion}
          />
        ))}
      </div>
    </div>
  );
};

export default Panel;
