// pages/Panel.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CitasPanel from "../components/CitasPanel";
import "../styles/Panel.css";
import CalendarioSemanal from "../components/CalendarioSemanal";

const Panel: React.FC = () => {
  return (
    <div>
     <h2 className="calendar-title"> MI CALENDARIO SEMANAL</h2>
      <CalendarioSemanal />
           
      <div style={{ padding: "20px" }}>
        <h2 className="calendar-title"> MIS CITAS RECIENTES</h2>
        <CitasPanel />
      </div>
    </div>
    
  );
};

export default Panel;
