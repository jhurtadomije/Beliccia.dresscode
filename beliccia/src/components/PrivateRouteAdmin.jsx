// PrivateRouteAdmin.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRouteAdmin({ children }) {
  const token = localStorage.getItem("auth_token");
  const user = JSON.parse(localStorage.getItem("auth_user") || "null");
  const role = user?.rol || user?.role;

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

