import "../styles/Infoprofesional.css";
import MapaDireccion from "./MapaDireccion";
import React, { useEffect, useState } from "react";
import { getDireccion } from "../utils/geocoding";
import { fetchConAuth } from "../utils/fetchConAuth";

interface FormacionItem {
  logo: string;
  universidad: string;
  anios: string;
}

interface UserProfile {
  lat: number;
  lon: number;
  burbujas: string[];
  photoUrl: string | null;
  numero_registro: string;
  anios_experiencia: number;
  idiomas: string[];
  licenciatura: { universidad: string; titulo: string };
  maestria: { universidad: string; titulo: string };
  horario_atencion: string;
}

const Infoprofesional: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [direccion, setDireccion] = useState<any>(null);
  const formacion = [
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1TYqb8Z7Fyyt8k3uLpvdB848NyyjE_S8Rg&s",
    universidad: user?.licenciatura?.universidad || "Universidad no disponible",
    anios: user?.licenciatura?.titulo || "Título no disponible",
  },
  {
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1TYqb8Z7Fyyt8k3uLpvdB848NyyjE_S8Rg&s",
    universidad: user?.maestria?.universidad || "Universidad no disponible",
    anios: user?.maestria?.titulo || "Título no disponible",
  },
];

const burbujas = [
  `${user?.anios_experiencia} años de experiencia`,
  `Idiomas: ${user?.idiomas?.join(", ") || "No disponible"}`
];
  // 1. Traer datos del backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchConAuth("http://127.0.0.1:8000/api/agenda/user_profile/");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data: UserProfile = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // 2. Cuando tenga lat y lon, obtener dirección
  useEffect(() => {
    if (user?.lat && user?.lon) {
      (async () => {
        const datos = await getDireccion(user.lat, user.lon);
        if (datos) setDireccion(datos);
      })();
    }
  }, [user?.lat, user?.lon]);

  if (!user) return <p>Cargando información...</p>;

  return (
    <div className="info-profesional">
      <h2 className="titulo">Informacion Porfesional</h2>

      {/* Línea de tiempo de formación */}
      <div className="formacion-timeline">
      {formacion.map((item, index) => (
        <div key={index} className="timeline-item">
          <img src={item.logo} alt="Logo Universidad" className="logo-univ" />
          <div className="timeline-info">
            <p className="uni-nombre">{item.universidad}</p>
            <p className="uni-anios">{item.anios}</p>
          </div>
        </div>
      ))}
    </div>


      {/* Información adicional en burbujas */}
      <div className="info-burbujas">
        {burbujas.map((b, i) => (
          <span key={i} className="burbuja">{b}</span>
        ))}
      </div>

      {/* Número de registro y horario */}
      <div className="registro-horario">
        <p><strong>Número de registro:</strong> {user.numero_registro}</p>
        <p><strong>Horario de atención:</strong> {user.horario_atencion}</p>
      </div>
      
      <MapaDireccion
        lat={user.lat}
        lng={user.lon}
        ciudad={direccion?.ciudad}
        calle={direccion?.calle}
        referencia={direccion?.referencia}
      />
    </div>
  );
};

export default Infoprofesional;
