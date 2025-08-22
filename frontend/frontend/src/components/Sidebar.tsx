// components/Sidebar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css"; // CSS para animaciones
import { FaUser, FaCalendarAlt, FaNewspaper, FaLightbulb, FaHome, FaSignOutAlt } from "react-icons/fa";
import Logo from "../components/Logo";


const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentLeft, setCurrentLeft] = useState(-220); // posición inicial móvil

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - startX;
    let newLeft = Math.min(0, -220 + delta); // no se pasa del borde
    setCurrentLeft(newLeft);
  };

  const handleTouchEnd = () => {
    // decide si se expande o se oculta
    if (currentLeft > -125) setExpanded(true);
    else setExpanded(false);
  };

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="logo-wrapper_1">
        <Logo variant="left" size="small" className="main-logo1" />
         
         {expanded && <Logo variant="right" size="medium" className="main-logo2" />}
      </div>

<div className="sidebar-section">

        <h4 className="sidebar-title">{expanded && "General"}</h4>
        <Link to="/panel/informacion" className="sidebar-link">
          <FaUser />
          {expanded && <span className="text-section">Información</span>}
        </Link>
        <Link to="/panel/horarios" className="sidebar-link">
         <FaCalendarAlt />
          {expanded && <span className="text-section">Horarios</span>}
        </Link>
        <Link to="/panel/publicaciones" className="sidebar-link">
          <FaNewspaper />
          {expanded && <span className="text-section">Publicaciones</span>}
        </Link>
      </div>

      <div className="sidebar-section">
        <h4 className="sidebar-title">{expanded && "Extra"}</h4>
        <Link to="/" className="sidebar-link">
          <FaLightbulb />
          {expanded && <span className="text-section">Sugerencias</span>}
        </Link>
        <Link to="/" className="sidebar-link">
          <FaHome />
          {expanded && <span className="text-section">Página Principal</span>}
        </Link>
      </div>

      <div className="sidebar-logout">
        <Link to="/logout" className="sidebar-link">
          <FaSignOutAlt />
          {expanded && <span className="text-section">Cerrar sesión</span>}
        </Link>
      </div>
    
    </div>
  );
};

export default Sidebar;
