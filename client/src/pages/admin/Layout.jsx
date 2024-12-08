import { Drawer } from "../../components/ui";
import { Route, Routes } from "react-router";
import Admin from ".";
import NoPage from "../NoPage";
import UserDetail from "./users/user-detail";
import Users from "./users";

export default function AdminLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
      }}
    >
      <Drawer items={[{ label: "Users", link: "/admin/users" }]} />

      <div style={{ minWidth: 0 }}>
        <Routes>
          <Route path="" element={<Admin />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </div>
    </div>
  );
}
