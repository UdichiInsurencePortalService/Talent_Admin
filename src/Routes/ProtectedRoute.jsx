import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

  // ❌ not logged in → go to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in → allow access
  return children;
}
