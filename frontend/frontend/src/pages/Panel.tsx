// pages/Panel.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/Panel.css";

const Panel: React.FC = () => {
  return (
    <div className="panel-container">
    
      <Sidebar />
      <div className="panel-content">
          <Header />
      <Outlet />
      </div>
    </div>
  );
};

export default Panel;
