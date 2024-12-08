import "./Select.css";
import { useRef, useState } from "react";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export default function Select({
  className,
  defaultValue,
  dim,
  error,
  errors,
  fullWidth,
  label,
  name,
  onChange,
  options,
  required,
  style,
  ...rest
}) {
  const selectRef = useRef(null);

  const [valueState, setValueState] = useState(defaultValue);

  if (valueState) {
    setTimeout(() => {
      selectRef.current.value = valueState;
    }, 0);
  }

  const handleChange = ({ target: { name, value } }) => {
    onChange?.(value, name);
    setValueState(value);
  };

  const errorValue = error || errors?.errors?.[name];

  return (
    <label className={className} style={style}>
      {label && (
        <span className="Select-label">
          {label}: {required && <span className="text-danger">*</span>}
        </span>
      )}
      <select
        {...rest}
        className={cn(
          "form-control",
          dim && `form-control-${dim}`,
          error && "is-invalid",
          fullWidth && "w-full"
        )}
        name={name}
        onChange={handleChange}
        ref={selectRef}
        required={required}
        value={valueState}
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {errorValue && (
        <div className="Select-error collapse-down text-danger text-sm">
          {errorValue}
        </div>
      )}
    </label>
  );
}

Select.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  dim: PropTypes.oneOf(["sm", "md", "lg"]),
  error: PropTypes.string,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  required: PropTypes.bool,
  style: PropTypes.object,
};
