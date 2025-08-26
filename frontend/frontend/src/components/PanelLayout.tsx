import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/PanelLayout.css";

const PanelLayout = () => {
  const location = useLocation();

  // Oculta header en rutas específicas
  const hideHeaderRoutes = ["/panel/informacion"];
  const showHeader = !hideHeaderRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="panel-layout">
      <Sidebar />
      <div className="panel-content">
        {showHeader && <Header />}
        <main>
          <Outlet /> {/* páginas hijas */}
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
