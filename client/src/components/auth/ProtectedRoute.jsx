import { Navigate } from "react-router";
import { use } from "react";
import PropTypes from "prop-types";
import SessionContext from "../../contexts/session";

export default function ProtectedRoute({ children, role }) {
  const { currentUser } = use(SessionContext);

  if (!currentUser || (role && currentUser.role !== role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};
