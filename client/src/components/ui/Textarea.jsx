import "./Textarea.css";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export default function Textarea({
  className,
  error,
  errors,
  fullWidth,
  label,
  name,
  required,
  style,
  ...rest
}) {
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
          required={required}
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
  error: PropTypes.string,
  errors: PropTypes.object,
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  style: PropTypes.object,
};
