// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string; // ✅ agregar value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ agregar onChange
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
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
        value={value}               // ✅ vinculado al estado
        onChange={onChange}         // ✅ vinculado al estado
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className="input-field"
      />
    </div>
  );
};

export default InputField;
