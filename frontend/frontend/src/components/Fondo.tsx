import React, { ReactNode } from "react";
import "../styles/Login.css";

interface FondoProps {
  children: ReactNode;
}

const Fondo: React.FC<FondoProps> = ({ children }) => {
  return <div className="fondo">{children}</div>;
};

export default Fondo;
