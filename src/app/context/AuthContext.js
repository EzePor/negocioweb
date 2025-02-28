"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider montado"); // ✅ Esto debe aparecer en la consola
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const storedUser = localStorage.getItem("usuario");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    console.log("🟢 Intentando login con:", email, password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔍 Respuesta del backend:", data);

      if (!res.ok) {
        console.error("❌ Error en autenticación:", res.status, res.statusText);
        return;
      }

      if (data.token && data.usuario) {
        if (typeof window !== "undefined") {
          console.log("✅ Guardando en localStorage...");
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("token", data.token);
          window.location.href = "/productos"; // Redirigir a la página principal
        }

        setUsuario(data.usuario);
        setToken(data.token);

        console.log("✅ Usuario logueado:", data);
        return data;
      } else {
        console.warn("⚠️ Backend no devolvió usuario correctamente");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
    }
  };

  const logout = () => {
    console.log("🔴 Cerrando sesión...");
    if (typeof window !== "undefined") {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
    }
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
