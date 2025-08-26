import React from "react";
import TarjetaCrearPublicacion from "../components/TarjetaCrearPublicacion";
import "../styles/Publicaciones.css"; // Importamos estilos clásicos
import ListaPublicaciones from "../components/ListaPublicaciones";

const publicaciones: React.FC = () => {
  return (
    <div className="publicaciones-grid">
      {/* Primera tarjeta: crear publicación */}
      <TarjetaCrearPublicacion />

      {/* Aquí después se listarán las demás publicaciones */}
        <ListaPublicaciones />
    </div>
  );
};

export default publicaciones;
