// src/components/PrivateRouteAdmin.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRouteAdmin({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Solo admin o dependienta
  if (!token || !["admin", "dependienta"].includes(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
