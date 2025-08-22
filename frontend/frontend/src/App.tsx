import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import Horarios from "./pages/Horarios";
import Informacion from "./pages/Informacion";
import Publicaciones from "./pages/Publicaciones";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/panel" element={<Panel />}>
          <Route path="horarios" element={<Horarios />} />
          <Route path="informacion" element={<Informacion />} />
          <Route path="panel" element={<Panel />} />
          <Route path="publicaciones" element={<Publicaciones />} />
        </Route>
      </Routes>
    </Router>
  );
}
