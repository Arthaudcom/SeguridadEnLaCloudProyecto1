import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import PostDetail from "./pages/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection si déjà connecté */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}



