import React from "react";
import TarjetaCrearPublicacion from "../components/TarjetaCrearPublicacion";
import "../styles/Publicaciones.css"; // Importamos estilos clásicos

const Publicaciones: React.FC = () => {
  return (
    <div className="publicaciones-grid">
      {/* Primera tarjeta: crear publicación */}
      <TarjetaCrearPublicacion />

      {/* Aquí después se listarán las demás publicaciones */}
    </div>
  );
};

export default Publicaciones;
