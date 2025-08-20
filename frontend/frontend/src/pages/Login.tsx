import React from "react";
import Fondo from "../components/Fondo";
import Logo from "../components/Logo";
import InputField from '../components/Button';
import Button from '../components/InputField';
import "../styles/Login.css";


const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de login aquí
    console.log('Formulario enviado');
  };

  return (
    <Fondo>
      <div className="overlay"></div>
      <div className="login-container">
        <div className="left-side">
          <div style={{ paddingLeft: '130px' }}>
            <Logo variant="full" size="large" className="main-logo" />
          </div>
            <div className="welcome-content">
              <h1 className="welcome-title">Bienvenido</h1>
              <h1 className="welcome-title">ABOGADO</h1>
              <h3 className="welcome-subtitle">Sección exclusiva</h3>
              <p className="welcome-description">
                Gestiona tus citas, publica avisos y consulta el historial de tus casos, 
                todo desde un mismo lugar.
              </p>
            </div>
        </div>
        <div className="right-side">
           <div className="auth-right">
      <h3 className="login-title">Login In:</h3>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input 
          type="hidden" 
          name="csrfmiddlewaretoken" 
          value="EC7VrS06m5cFAhiYxrnP3WZJWozT8uTUcC5bgZIIOsLH9GvQz5K1CJZpz2ph5Qpx" 
        />
        <span className="titulo-input"><strong>Username: </strong></span>
        <InputField
          label="Username:"
          type="text"
          id="id_username"
          name="username"
          autoComplete="username"
          autoFocus={true}
        />
        <span className="titulo-input"><strong>Pasword: </strong></span>

        <InputField
          label="Password:"
          type="password"
          id="id_password"
          name="password"
          autoComplete="current-password"
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