// components/PanelLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/PanelLayout.css";


const PanelLayout = () => {
  return (
    <div className="panel-layout">
      <Sidebar />
      <div className="panel-content">
        <Header />
        <main>
          <Outlet /> {/* aquí se cargan las páginas hijas */}
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
