import React, { useState } from "react";
import "../styles/TablaCitas.css"; // estilos CSS clásicos

interface Cita {
  id: number;
  titulo: string;
  telefono: string;
  email: string;
  fecha: string;
}

interface Props {
  citas: Cita[];
}

const TablaCitas: React.FC<Props> = ({ citas }) => {
  const [atendidos, setAtendidos] = useState<{ [id: number]: boolean }>({});

  const toggleAtendido = (id: number) => {
    setAtendidos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <table className="tabla-citas">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Fecha</th>
          <th>Atendido</th>
        </tr>
      </thead>
      <tbody>
        {citas.map(cita => (
          <tr key={cita.id}>
            <td>{cita.titulo}</td>
            <td>{cita.telefono || "—"}</td>
            <td>{cita.email || "—"}</td>
            <td>{cita.fecha}</td>
            <td>
              <input
                type="checkbox"
                checked={atendidos[cita.id] || false}
                onChange={() => toggleAtendido(cita.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaCitas;
