// components/InputField.tsx
import React from 'react';


interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  required = true,
  autoComplete,
  autoFocus = false
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className="input-field"
      />
    </div>
  );
};

export default InputField;