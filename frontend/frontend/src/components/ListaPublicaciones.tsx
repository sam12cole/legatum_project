import React, { useEffect, useState } from "react";
import MiniTarjetaPublicacion from "../components/MiniTarjetaPublicacion";
import { useNavigate } from "react-router-dom";
import { fetchConAuth } from "../utils/fetchConAuth";

interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string | null;
  fecha: string;
}

const ListaPublicaciones: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const navigate = useNavigate();
  const palette = [
      "#2a2dcb9e",
      "#95acf0ab",
      "#e67aa5b0",
      "#7ae6c493",
      "#f0a57a9b",
    ];

useEffect(() => {
  const fetchPublicaciones = async () => {

    try {
      const response = await fetchConAuth("http://127.0.0.1:8000/api/agenda/listar_publicaciones/");

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setPublicaciones(data);
    } catch (err) {
      console.error("Error fetching publicaciones:", err);
    }
  };

  fetchPublicaciones();
}, []);

  const handleEdit = (id: number) => {
    // navega a la ruta de edición de esa publicación
    navigate(`/panel/publicaciones/editar/${id}`);
  };

    const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;

        try {
      const response = await fetchConAuth(`http://127.0.0.1:8000/api/agenda/publicaciones/${id}/eliminar/`,
  { method: "DELETE" });

      if (!response) return; // token expirado
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      // actualizar la UI quitando la publicación eliminada
      setPublicaciones(publicaciones.filter(pub => pub.id !== id));
    } catch (err) {
      console.error("Error eliminando publicación:", err);
    }
  };

  return (
    <>
      {publicaciones.map((pub, index) => {
        const color = palette[index % palette.length]; // cicla por los colores
        return (
          <MiniTarjetaPublicacion
            key={pub.id}
            publicacionId={pub.id}
            color={color}
            isAdmin={true}              // 👈 aparece barra con botones
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      })}
    </>
  );
};


export default ListaPublicaciones;
