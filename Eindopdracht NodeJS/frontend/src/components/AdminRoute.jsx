import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { accessToken, user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px" }}>Laden...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/services" />;
  }

  return children;
}

export default AdminRoute;
