import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PanelLayout from "./components/PanelLayout";
import Panel from "./pages/Panel";
import Horarios from "./pages/Horarios";
import Informacion from "./pages/Informacion";
import Publicaciones from "./pages/Publicaciones";
import CrearPublicacion from "./pages/CrearPublicacion";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panel" element={<PanelLayout />}>
          <Route index element={<Panel />} />
          <Route path="horarios" element={<Horarios />} />
          <Route
            path="informacion"
            element={<Informacion />}
            // pasamos prop al layout
          />
          <Route path="publicaciones" element={<Publicaciones />} />
          <Route path="publicaciones/crear" element={<CrearPublicacion />} />
          <Route path="publicaciones/editar/:id" element={<CrearPublicacion />} />
        </Route>
      </Routes>
    </Router>
  );
}
