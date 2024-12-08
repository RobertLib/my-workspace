import "./Textarea.css";
import { useState } from "react";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export default function Textarea({
  className,
  defaultValue,
  error,
  errors,
  fullWidth,
  label,
  name,
  onChange,
  required,
  style,
  ...rest
}) {
  const [valueState, setValueState] = useState(defaultValue ?? "");

  const handleChange = ({ target: { name, value } }) => {
    onChange?.(value, name);
    setValueState(value);
  };

  const errorValue = error || errors?.errors?.[name];

  return (
    <label className={className} style={style}>
      {label && (
        <span className="Textarea-label">
          {label}: {required && <span className="text-danger">*</span>}
        </span>
      )}
      <span>
        <textarea
          {...rest}
          className={cn(
            "form-control",
            error && "is-invalid",
            fullWidth && "w-full"
          )}
          name={name}
          onChange={handleChange}
          required={required}
          value={valueState}
        />
        {errorValue && (
          <div className="Textarea-error collapse-down text-danger text-sm">
            {errorValue}
          </div>
        )}
      </span>
    </label>
  );
}

Textarea.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  error: PropTypes.string,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  style: PropTypes.object,
};
