// components/Header.tsx
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import "../styles/Header.css";
import { fetchConAuth } from "../utils/fetchConAuth";

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photoUrl?: string | null;
}

const Header: React.FC = () => {
const [user, setUser] = useState<UserProfile | null>(null);

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

if (!user) return null; // esperar a que cargue

  return (
    <header>
      <div className="header-bar">
        <div className="header-left">
          <h3>Bienvenido</h3>
          <h4>Dr. {user.lastName}</h4>
          <p>Aquí puedes agendar citas, ver horarios y hacer publicaciones.</p>
        </div>

        <div className="header-right">
          <div className="notification">
            <FaBell />
          </div>

          <div className="mini-card">
            <div className="mini-card-img">
              {user.photoUrl ? (
                <img src={`http://127.0.0.1:8000${user.photoUrl}`} alt="Foto del abogado" />
              ) : (
                <p>Sin foto</p>
              )}
            </div>


            <div className="mini-card-text">
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>{user.username}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
