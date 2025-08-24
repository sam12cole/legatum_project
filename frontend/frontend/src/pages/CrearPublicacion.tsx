import React, { useState, useEffect } from "react";
import "../styles/CrearPublicacion.css";

interface PublicacionData {
  id?: number;
  titulo: string;
  contenido: string;
  imagen?: File | null;
}

interface CrearPublicacionProps {
  publicacionId?: number; // Si existe, estamos editando
}

const CrearPublicacion: React.FC<CrearPublicacionProps> = ({ publicacionId }) => {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Si editamos, cargamos los datos existentes
useEffect(() => {
  if (!publicacionId) return;

  const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("No hay token. Inicia sesión primero.");
      setLoading(false);
      return;
    }

  fetch(`http://127.0.0.1:8000/api/agenda/publicaciones/${publicacionId}/`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar la publicación");
      return res.json();
    })
    .then(data => {
      setTitulo(data.titulo);
      setContenido(data.contenido);
      if (data.imagen) setPreview(`http://127.0.0.1:8000${data.imagen}`);
    })
    .catch(err => console.error(err));
}, [publicacionId]);


  // 🔹 Preview de la imagen seleccionada
  useEffect(() => {
    if (!imagen) return setPreview(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(imagen);
  }, [imagen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("contenido", contenido);
      if (imagen) formData.append("imagen", imagen);

      const token = localStorage.getItem("token");

      const url = publicacionId
        ? `http://127.0.0.1:8000/api/agenda/publicaciones/editar/${publicacionId}/`
        : `http://127.0.0.1:8000/api/agenda/publicaciones/crear/`;

      const method = publicacionId ? "PUT" : "POST";



      const res = await fetch(url, {
        method,
        headers: { "Authorization": `Token ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar la publicación");

      const data = await res.json();
      setMensaje(`Publicación "${data.titulo}" guardada con éxito ✅`);
      if (!publicacionId) {
        setTitulo("");
        setContenido("");
        setImagen(null);
        setPreview(null);
      }
    } catch (error: any) {
      console.error(error);
      setMensaje(error.message || "Error de conexión con el backend ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-publicacion">
      <h1>{publicacionId ? "Editar Publicación" : "Crear Publicación"}</h1>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <form className="formulario-publicacion" onSubmit={handleSubmit}>
        <label>
          <strong>Título:</strong>
          <input
            className="input-field"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>

        <label>
          <strong>Contenido:</strong>
          <textarea
            className="input-field"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </label>

        <label>
          <strong>Imagen:</strong>
          <input
            type="file"
            className="input-field"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files?.[0] || null)}
          />
        </label>

        {preview && (
          <div className="preview">
            <p>Preview de la imagen:</p>
            <img src={preview} alt="preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Publicación"}
        </button>
      </form>
    </div>
  );
};

export default CrearPublicacion;
