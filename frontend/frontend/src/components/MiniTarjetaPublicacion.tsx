// MiniTarjetaPublicacion.tsx
import React, { useEffect, useState } from "react";
import "../styles/MiniTarjetaPublicacion.css";
import { FiCalendar } from "react-icons/fi";
import { FiEdit, FiTrash2 } from "react-icons/fi"; 
import { fetchConAuth } from "../utils/fetchConAuth";

interface MiniTarjetaPublicacionProps {
  publicacionId: number;
  color: string;
  isAdmin?: boolean; // 👈 nuevo prop (false por defecto)
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string | null;
  fecha: string;
}

interface Usuario {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photoUrl?: string | null;
  especialidad: string | null;
}

const MiniTarjetaPublicacion: React.FC<MiniTarjetaPublicacionProps> = ({ publicacionId, color,isAdmin = false, 
  onEdit, 
  onDelete  }) => {
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);


useEffect(() => {
  if (!publicacionId) return;

  const fetchDatos = async () => {
    try {
      const [resPublicacion, resUsuario] = await Promise.all([
        fetchConAuth(`http://127.0.0.1:8000/api/agenda/publicaciones/${publicacionId}/`),
        fetchConAuth("http://127.0.0.1:8000/api/agenda/user_profile/")
      ]);

      if (!resPublicacion || !resUsuario) return; // token expirado

      if (!resPublicacion.ok) throw new Error(`Error publicación: ${resPublicacion.status}`);
      if (!resUsuario.ok) throw new Error(`Error usuario: ${resUsuario.status}`);

      const dataPublicacion = await resPublicacion.json();
      const dataUsuario = await resUsuario.json();

      setPublicacion(dataPublicacion);
      setUsuario(dataUsuario);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  fetchDatos();
}, [publicacionId]);


  if (!publicacion || !usuario) return <p>Cargando...</p>;

  return (
    <div className="mini-tarjeta-publicacion"  style={{ backgroundColor: color }} >
            {/* 🔧 Barra superior solo si es admin */}
      {isAdmin && (
        <div className="acciones-bar">
         <button 
          className="accion-btn" 
          onClick={() => onEdit && onEdit(publicacion.id)} 
          aria-label="Editar publicación" 
          title="Editar publicación"
        >
          <FiEdit size={18} />
        </button>

        <button 
          className="accion-btn eliminar" 
          onClick={() => onDelete && onDelete(publicacion.id)} 
          aria-label="Eliminar publicación" 
          title="Eliminar publicación"
        >
          <FiTrash2 size={18} />
        </button>

        </div>
      )}

      <div className="mini-tarjeta-publicacion-imagen">
        {publicacion.imagen ? (
          <img
            className="mini-tarjeta-publicacion-imagen"
            src={`http://127.0.0.1:8000${publicacion.imagen}`}
            alt="Imagen de la publicación"
          />
        ) : (
          <p>Sin imagen</p>
        )}
      </div>
      <div className="mini-tarjeta-publicacion-contenido">
        <p className="mini-tarjeta-publicacion-especialidad">{usuario.especialidad}</p>
        <h3 className="mini-tarjeta-publicacion-titulo">{publicacion.titulo}</h3>
      </div>
      <div className="mini-tarjeta-publicacion-footer" style={{ backgroundColor: color }}>
        <div className="mini-tarjeta-publicacion-fecha">
          <FiCalendar style={{ marginRight: "4px" }} />
          {new Date(publicacion.fecha).toLocaleDateString()}
        </div>
        <div className="mini-tarjeta-publicacion-autor">
              {usuario.photoUrl ? (
                <img className="mini-tarjeta-publicacion-avatar" src={`http://127.0.0.1:8000${usuario.photoUrl}`} alt="Foto del abogado" />
              ) : (
                <p>Sin foto</p>
              )}
          <span>{`${usuario.firstName} ${usuario.lastName}`}</span>
        </div>
      </div>
    </div>
  );
};

export default MiniTarjetaPublicacion;
