import "./Select.css";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export default function Select({
  className,
  dim,
  error,
  errors,
  fullWidth,
  label,
  name,
  options,
  required,
  style,
  ...rest
}) {
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
        required={required}
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
  dim: PropTypes.oneOf(["sm", "md", "lg"]),
  error: PropTypes.string,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  required: PropTypes.bool,
  style: PropTypes.object,
};
