import { Link, useLocation } from "react-router";
import { use } from "react";
import DrawerContext from "../../contexts/drawer";
import Dropdown from "./Dropdown";
import Menu from "../../assets/icons/Menu";
import SessionContext from "../../contexts/session";

export default function Navbar() {
  const { currentUser } = use(SessionContext);
  const { toggleDrawer } = use(DrawerContext);
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
          {pathname.startsWith("/admin") && (
            <button
              className="btn visible-sm"
              onClick={toggleDrawer}
              style={{ marginLeft: "-1rem" }}
              type="button"
            >
              <Menu />
            </button>
          )}

          <Link className="link font-semibold text-lg" to="/">
            MyWorkspace
          </Link>
        </span>

        {currentUser && (
          <Dropdown
            label={currentUser.email}
            style={{ marginRight: "-0.5rem" }}
          >
            {currentUser.role === "ADMIN" && (
              <Link className="btn justify-start w-full" to="/admin/users">
                Admin
              </Link>
            )}
            <Link className="btn justify-start w-full" to="/auth/logout">
              Logout
            </Link>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
