import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
export const AuthContext = createContext();

// Provider component
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password }), // or use email if your backend supports it
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setAuth({ token: data.token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  const value = {
    auth,
    login,
    logout,
    isAuthenticated: !!auth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// ✅ Export provider as default
export default AuthProvider;
