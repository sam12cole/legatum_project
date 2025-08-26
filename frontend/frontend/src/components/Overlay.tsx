import React, { useState } from "react";
import "../styles/Overlay.css"; // aquí va el CSS que te doy abajo

const CrearPublicacion: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ...tu lógica de crear publicación

    // Mostrar overlay al crear correctamente
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* tus inputs y botón */}
        <button type="submit">Crear Publicación</button>
      </form>

      {showOverlay && (
        <div className="overlay-publicacion">
          <div className="modal">
            <div className="checkmark">✔️</div>
            <div className="message">Se ha creado la publicación</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearPublicacion;
