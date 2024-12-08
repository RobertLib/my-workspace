import "./Input.css";
import { useState } from "react";
import Button from "./Button";
import cn from "../../utils/cn";
import Eye from "../../assets/icons/Eye";
import EyeSlash from "../../assets/icons/EyeSlash";
import PropTypes from "prop-types";

export default function Input({
  className,
  defaultValue,
  dim,
  error,
  errors,
  fullWidth,
  label,
  name,
  onChange,
  required,
  style,
  type = "text",
  ...rest
}) {
  const [typeState, setTypeState] = useState(type);
  const [valueState, setValueState] = useState(defaultValue ?? "");

  const handleChange = ({ target: { name, value } }) => {
    onChange?.(value, name);
    setValueState(value);
  };

  const errorValue = error || errors?.errors?.[name];

  return (
    <label className={className} style={style}>
      {label && (
        <span className="Input-label">
          {label}: {required && <span className="text-danger">*</span>}
        </span>
      )}
      <span>
        <span className="Input-container">
          <input
            {...rest}
            className={cn(
              "form-control",
              dim && `form-control-${dim}`,
              error && "is-invalid",
              fullWidth && "w-full"
            )}
            name={name}
            onChange={handleChange}
            required={required}
            type={type === "password" ? typeState : type}
            value={valueState}
          />
          {type === "password" && (
            <Button
              onClick={() => {
                setTypeState((prevState) =>
                  prevState === "password" ? "text" : "password"
                );
              }}
              variant="default"
            >
              {typeState === "password" ? <Eye /> : <EyeSlash />}
            </Button>
          )}
        </span>
        {errorValue && (
          <div className="Input-error collapse-down text-danger text-sm">
            {errorValue}
          </div>
        )}
      </span>
    </label>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  dim: PropTypes.oneOf(["sm", "md", "lg"]),
  error: PropTypes.string,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  style: PropTypes.object,
  type: PropTypes.string,
};
