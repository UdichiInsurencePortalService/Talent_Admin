import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../Authentication/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Checking authentication...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
}
