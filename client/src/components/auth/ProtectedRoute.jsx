import { Navigate } from "react-router-dom";
import { useSession } from "../../contexts/session";
import PropTypes from "prop-types";

export default function ProtectedRoute({ children, role }) {
  const { currentUser } = useSession();

  if (!currentUser || (role && currentUser.role !== role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};
