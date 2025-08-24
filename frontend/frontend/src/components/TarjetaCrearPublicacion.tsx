// components/TarjetaCrearPublicacion.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TarjetaCrearPublicacion.css"; // estilos clásicos

const TarjetaCrearPublicacion: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/panel/publicaciones/crear");
  };

  return (
    <div className="tarjeta-crear" onClick={handleClick}>
      <div className="icono_2">+</div>
      <p className="texto">Crear Publicación</p>
    </div>
  );
};

export default TarjetaCrearPublicacion;
