import { useState } from 'react';
import './FormInput.css';

const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  required = false,
  placeholder = '',
  error = '',
  ...rest 
}) => {
  const [touched, setTouched] = useState(false);

  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="required-mark">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        className={`form-control ${touched && error ? 'form-control-error' : ''}`}
        placeholder={placeholder}
        required={required}
        {...rest}
      />
      {touched && error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;