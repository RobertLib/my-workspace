import PropTypes from "prop-types";

export default function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-danger" style={{ marginBottom: "1rem" }}>
      {message}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
};
