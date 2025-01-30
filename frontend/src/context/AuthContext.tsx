import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  user: string | null; 
  token: string | null; // JWT token
  login: (token: string) => void; 
  logout: () => void; 
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<JwtPayload & { username: string }>(storedToken);
      setUser(decodedToken.username); 
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode<JwtPayload & { username: string }>(token);
    setUser(decodedToken.username);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
