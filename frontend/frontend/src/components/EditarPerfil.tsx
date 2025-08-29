import React, { useState } from "react";
import { fetchConAuth } from "../utils/fetchConAuth";
import "../styles/EditarPerfil.css";

interface Props {
  user: any; // puedes tipar según tu UserProfile
  onUpdate: (updatedUser: any) => void; // función para actualizar el estado padre
}

const EditarPerfil: React.FC<Props> = ({ user, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    especialidad: user.especialidad || "",
    telefono: user.telefono || "",
    latitud: user.latitud || "",
    longitud: user.longitud || "",
    anios_experiencia: user.anios_experiencia || "",
    horario_atencion: user.horario_atencion || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetchConAuth("http://127.0.0.1:8000/api/agenda/user_profile/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            especialidad: formData.especialidad,
            telefono: formData.telefono,
            latitud: formData.latitud,
            longitud: formData.longitud,
            anios_experiencia: formData.anios_experiencia,
            horario_atencion: formData.horario_atencion,
        }),
        });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      onUpdate(formData); // actualiza estado padre
      setShowModal(false); // cierra modal
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn-editar" onClick={() => setShowModal(true)}>
        Editar Perfil
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
              <label>
               <p className="form-titulos">  Especialidad:</p>
                <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} />
              </label>
              <label>
               <p className="form-titulos">   Teléfono:</p>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
              </label>
              <label>
               <p className="form-titulos">   Latitud:</p>
                <input type="text" name="latitud" value={formData.latitud} onChange={handleChange} />
              </label>
              <label>
               <p className="form-titulos">   Longitud:</p>
                <input type="text" name="longitud" value={formData.longitud} onChange={handleChange} />
              </label>
             
              <label>
                <p className="form-titulos">  Horario de atención:</p>
                <input type="text" name="horario_atencion" value={formData.horario_atencion} onChange={handleChange} />
              </label>

              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditarPerfil;
