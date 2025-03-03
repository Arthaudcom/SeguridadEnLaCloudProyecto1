import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode, JwtPayload } from "jwt-decode";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  const decodedToken = jwtDecode<JwtPayload & { exp: number }>(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    console.log("Token expired, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
