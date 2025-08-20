// components/Button.tsx
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
  onClick,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`auth-btn ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;