import { BrowserRouter as Router, Route, Routes } from "react-router";
import { DrawerProvider } from "./contexts/drawer";
import { SessionProvider } from "./contexts/session";
import { SnackbarProvider } from "./contexts/snackbar";
import { Suspense, lazy } from "react";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import NoPage from "./pages/NoPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

const AdminLayout = lazy(() => import("./pages/admin/Layout"));

function App() {
  return (
    <SessionProvider>
      <SnackbarProvider>
        <DrawerProvider>
          <Router>
            <Suspense
              fallback={
                <div className="container">
                  <p>Loading...</p>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="auth/login" element={<Login />} />
                  <Route path="auth/logout" element={<Logout />} />
                  <Route path="auth/register" element={<Register />} />
                  <Route
                    path="auth/forgot-password"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="auth/reset-password"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="admin/*"
                    element={
                      <ProtectedRoute role="ADMIN">
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </DrawerProvider>
      </SnackbarProvider>
    </SessionProvider>
  );
}

export default App;
