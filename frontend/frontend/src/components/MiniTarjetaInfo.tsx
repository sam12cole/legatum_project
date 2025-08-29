import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/MiniTarjetaInfo.css";

const MiniTarjetaInfo = ({ imgAb, nomAb, usrAb, espAb, carAb, mailAb, telAb, ubiAb }) => {
  return (
    <div className="mini-tarjeta-2">
      <img src={imgAb} alt="Avatar" className="avatar" />
      <h3 className="nombre">{nomAb}</h3>
      <p className="usuario">@{usrAb}</p>
      <p className="especialidad">{espAb}</p>
      <p className="cargo">{carAb}</p>

      <div className="info-adicional">
        <p><FaEnvelope className="icono"/> {mailAb}</p>
        <p><FaPhone className="icono"/> {telAb}</p>
        <p><FaMapMarkerAlt className="icono"/> {ubiAb}</p>
      </div>
    </div>
  );
};

export default MiniTarjetaInfo;
