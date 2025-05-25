// src/routes/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// ✅ For pages that require auth (e.g., /cart, /orders)
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ✅ For login/signup — redirect to home if already logged in
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};
