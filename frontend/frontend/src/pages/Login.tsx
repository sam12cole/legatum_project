import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 para redirigir
import Fondo from "../components/Fondo";
import Logo from "../components/Logo";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (response.ok) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      navigate("/panel"); // redirigir al panel
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (err) {
    console.error("Error en login:", err);
  }
};



  return (
    <Fondo>
      <div className="overlay"></div>
      <div className="login-container">
        <div className="left-side">
          <div style={{ paddingLeft: "115px" }}>
            <Logo variant="full" size="large" className="main-logo" />
          </div>
          <div className="welcome-content">
            <h1 className="welcome-title">Bienvenido</h1>
            <h1 className="welcome-title">ABOGADO</h1>
            <h3 className="welcome-subtitle">Sección exclusiva</h3>
            <p className="welcome-description">
              Gestiona tus citas, publica avisos y consulta el historial de tus
              casos, todo desde un mismo lugar.
            </p>
          </div>
        </div>

        <div className="right-side">
          <div className="auth-right">
            <h3 className="login-title">Login In:</h3>
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <span className="titulo-input">
                <strong>Username: </strong>
              </span>
              <InputField
                type="text"
                id="id_username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />

              <span className="titulo-input">
                <strong>Password: </strong>
              </span>
              <InputField
                type="password"
                id="id_password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />

              <Button type="submit" className="login-btn">
                Entrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Fondo>
  );
};

export default Login;
