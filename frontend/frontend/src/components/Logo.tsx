import React from "react";

// Importa como URLs
import iconoSvg from '../assets/logo_icono.svg';
import letrasSvg from '../assets/logo_letras.svg';

interface LogoProps {
  variant?: "left" | "right" | "full";
  size?: "small" | "medium" | "large";
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = "full", 
  size = "medium", 
  className 
}) => {
  const sizes = {
    small: "120px",
    medium: "150px",
    large: "170px"
  };

  return (
    <div 
      className={className}
      style={{
    
        width: sizes[size],
        height: sizes[size],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        
      }}
    >
      {/* Parte izquierda (icono) */}
      {(variant === "left" || variant === "full") && (
        <img 
          src={iconoSvg} 
          alt="Icono" 
          style={{ 
            width: '55%', 
            height: '55%',
            objectFit: 'contain'
          }}
        />
      )}

      {/* Parte derecha (texto) */}
      {(variant === "right" || variant === "full") && (
        <img 
          src={letrasSvg} 
          alt="Texto" 
          style={{ 
            width: '110%', 
            height: '110%',
            objectFit: 'contain'
          }}
        />
      )}
    </div>
  );
};

export default Logo;