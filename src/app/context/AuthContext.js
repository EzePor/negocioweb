"use client";

import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider montado"); // ✅ Esto debe aparecer en la consola
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [cargandoAuth, setCargandoAuth] = useState(true); // ✅ Nuevo estado

  // Mejorar la inicialización del contexto
  useEffect(() => {
    const inicializarAuth = () => {
      try {
        setIsClient(true);
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("usuario");

        console.log("🔄 Inicializando AuthContext:", {
          tokenExiste: !!storedToken,
          usuarioExiste: !!storedUser,
        });

        if (storedUser && storedToken) {
          const usuarioParsed = JSON.parse(storedUser);

          // Verificar que el usuario tenga rol
          if (!usuarioParsed.rol) {
            console.warn("⚠️ Usuario sin rol - cerrando sesión");
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");
            return;
          }

          console.log("👤 Usuario recuperado:", {
            ...usuarioParsed,
            rol: usuarioParsed.rol,
          });

          setUsuario(usuarioParsed);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("❌ Error al inicializar auth:", error);
        // Limpiar storage en caso de error
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
      } finally {
        setCargandoAuth(false);
      }
    };

    inicializarAuth();
  }, []);

  const login = async (email, password) => {
    console.log("🟢 Intentando login con:", email);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🔍 Respuesta del backend:", {
        status: res.status,
        usuario: data.usuario
          ? {
              ...data.usuario,
              rol: data.usuario.rol,
            }
          : null,
      });

      if (!res.ok) {
        console.error("❌ Error en autenticación:", res.status, res.statusText);
        return;
      }

      // Verificar que vengan todos los datos necesarios
      if (data.token && data.usuario && data.usuario.rol) {
        if (typeof window !== "undefined") {
          console.log(
            "✅ Guardando en localStorage usuario con rol:",
            data.usuario.rol
          );
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("token", data.token);
          window.location.href = "/productos";
        }

        setUsuario(data.usuario);
        setToken(data.token);

        return data;
      } else {
        console.warn("⚠️ Datos de usuario incompletos:", {
          tieneToken: !!data.token,
          tieneUsuario: !!data.usuario,
          tieneRol: data.usuario?.rol,
        });
        throw new Error("Datos de usuario incompletos");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
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
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        token,
        setUsuario,
        cargandoAuth, // ✅ Lo agregamos al contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
