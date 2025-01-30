import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
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
      </Routes>
    </BrowserRouter>
  );
}
