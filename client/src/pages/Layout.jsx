import { Navbar } from "../components/ui";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}
