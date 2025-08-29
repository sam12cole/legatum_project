import React from "react";
import { useEffect, useState } from "react";
import "../styles/Informacion.css";
import MiniTarjetaInfo from "../components/MiniTarjetaInfo";
import Infoprofesional from "../components/Infoprofesional";
import DashboardCards from "../components/DashboardCards";
import { fetchConAuth } from "../utils/fetchConAuth";
import EditarPerfil from "../components/EditarPerfil";

type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photoUrl: string | null;
  especialidad: string;
  telefono: string;
  latitud: number;
  longitud: number;
  numero_registro: string;
  anios_experiencia: number;
  idiomas: string[];
  licenciatura: { universidad: string; titulo: string };
  maestria: { universidad: string; titulo: string };
  horario_atencion: string;
};



function Informacion() {

  const [user, setUser] = useState<UserProfile | null>(null);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <>
    <div className="header-1"> </div>
        <div className="informacion-contenedor">
        <div className="informacion-izquierda">
            <Infoprofesional
                
            />

        </div>
        <div className="informacion-derecha">
           <MiniTarjetaInfo
            imgAb={user.photoUrl ? `http://127.0.0.1:8000${user.photoUrl}` : undefined}
            nomAb={`${user.firstName} ${user.lastName}`}
            usrAb={user.username}
            espAb={user.especialidad}
            carAb="Abogado"
            mailAb={user.email}
            telAb={user.telefono}
            ubiAb="Riobamba, Ecuador"
            />
            <div className="info-cartas">
            <DashboardCards citas={12} publicaciones={8} />
            </div>
            <EditarPerfil user={user} onUpdate={(updated) => setUser({ ...user, ...updated })} />

        </div>

        </div>
    </>
  );
}

export default Informacion;
