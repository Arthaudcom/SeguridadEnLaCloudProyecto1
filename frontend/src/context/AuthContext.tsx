import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  user: string | null; 
  token: string | null; 
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
      const decodedToken = jwtDecode<JwtPayload & { exp: number; username: string }>(storedToken);
    
      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (!isExpired) {
        setToken(storedToken);
        setUser(decodedToken.username);
      } else {
        console.log("Token expired, logging out...");
        logout();
      }
    }
    
  }, []);

  const login = (token: string) => {
    const decodedToken = jwtDecode<JwtPayload & { exp: number; username: string }>(token);
  
    // Check expiration
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log("Token is already expired!");
      return;
    }
  
    localStorage.setItem("token", token);
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
