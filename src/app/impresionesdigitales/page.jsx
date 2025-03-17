"use client";

import { useState, useContext, useEffect } from "react";
import SubirFotos from "../componentes/SubirFotos";
import ListarFotos from "../componentes/ListarFotos";
import { AuthContext } from "../context/AuthContext";

const FotosUsuario = () => {
  const [actualizar, setActualizar] = useState(false);
  const { usuario, cargandoAuth } = useContext(AuthContext);
  console.log("📸 Renderizando FotosUsuario...", { usuario, cargandoAuth });

  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const storedUserData = localStorage.getItem("usuario");
        if (!usuario && !storedUserData) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        window.location.href = "/login";
      }
    };

    verificarAuth();
  }, [usuario]);

  if (cargandoAuth) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Subir y Administrar Fotos
      </h1>

      <SubirFotos onUploadSuccess={() => setActualizar(!actualizar)} />
      <ListarFotos key={actualizar} />
    </div>
  );
};

export default FotosUsuario;
