import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const SessionContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

export const SessionProvider = ({ children }) => {
  const token = localStorage.getItem("token");

  const [currentUser, setCurrentUser] = useState(
    token ? jwtDecode(token) : null
  );

  return (
    <SessionContext value={{ currentUser, setCurrentUser }}>
      {children}
    </SessionContext>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.node,
};

export default SessionContext;
