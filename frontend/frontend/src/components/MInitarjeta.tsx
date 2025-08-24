import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaVideo } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import "../styles/Minitarjeta.css";

const MiniTarjeta = ({
  nombre,
  fecha,
  estado,
  telefono,
  email,
  zoom,
  descripcion,
  servicio,
  modalidad,
  direccion
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [showDireccion, setShowDireccion] = useState(false); // para mostrar la dirección al click

  return (
    <div className="mini-tarjeta-full">
      {/* Sección horizontal */}
      <div className="mini-tarjeta-horizontal">
        {/* Lado izquierdo */}
        <div className="left">
          <div className="avatar-nombre">
            <div className="avatar">{nombre.charAt(0)}</div>
            <div className="nombre-fecha">
              <div className="nombre">{nombre}</div>
              <div className="fecha">{fecha}</div>
            </div>
          </div>
        </div>

        {/* Lado derecho: semáforo */}
          <div className="right">
            {/* Semáforo */}
            <div className={`semaforo ${estado.toLowerCase()}`}></div>

            {/* Modalidad clickeable */}
            <div
              className="modalidad"
              onClick={() => modalidad === "presencial" && setShowDireccion(!showDireccion)}
            >
              {modalidad === "virtual" ? "Atención Virtual" : "Atención Presencial"}
            </div>

            {/* Dirección solo si es presencial y showDireccion=true */}
            {modalidad === "presencial" && showDireccion && (
              <div className="direccion">{direccion}</div>
            )}
          </div>
      </div>

      {/* Encabezado con iconos */}
          <div className="mini-tarjeta-header">
            <div className="icono"><FaPhone /> {telefono}</div>
            <div className="icono"><FaEnvelope /> {email}</div>
            <div className="icono"><FaVideo /> {zoom}</div>
            <div className="tipo-caso">{servicio}</div>
          </div>

      {/* Botón de descripción */}
      <button
        className="boton-descripcion"
        onClick={() => setShowDescription(!showDescription)}
      >
        Descripción del caso <IoIosArrowDown />
      </button>

      {showDescription && <div className="descripcion">{descripcion}</div>}
    </div>
  );
};

export default MiniTarjeta;
