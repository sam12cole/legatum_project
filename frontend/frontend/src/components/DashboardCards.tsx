import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaRegNewspaper } from "react-icons/fa";
import "../styles/DashboardCards.css";

interface DashboardCardsProps {
  citas: number;
  publicaciones: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ citas, publicaciones }) => {
  const [countCitas, setCountCitas] = useState(0);
  const [countPubs, setCountPubs] = useState(0);

  // Animación de conteo
  useEffect(() => {
    let start = 0;
    const end = citas;
    if (start === end) return;

    let totalMilSecDur = 1000; // duración animación
    let incrementTime = (totalMilSecDur / end) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCountCitas(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [citas]);

  useEffect(() => {
    let start = 0;
    const end = publicaciones;
    if (start === end) return;

    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCountPubs(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [publicaciones]);

  return (
    <div className="dashboard-container">
      {/* Tarjeta Citas */}
      <div className="dashboard-card">
        <div> 
        <FaCalendarCheck className="card-icon" />
        </div>
        <div className="card-info">
          <h3>{countCitas}</h3>
          <p>Numero de Agendamientos</p>
        </div>
      </div>

      {/* Tarjeta Publicaciones */}
      <div className="dashboard-card-1">
        <FaRegNewspaper className="card-icon-1" />
        <div className="card-info-1">
          <h3>{countPubs}</h3>
          <p>Numero de Publicaciones</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
