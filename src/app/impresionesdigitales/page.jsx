"use client";

import { useState } from "react";
import SubirFotos from "../componentes/SubirFotos";
import ListarFotos from "../componentes/ListarFotos";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const MisFotos = () => {
  const [actualizar, setActualizar] = useState(false);
  const usuarioId = "ID_DEL_USUARIO"; // Aquí debes reemplazarlo con el ID real del usuario autenticado
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    if (!usuario) {
      // Redirigir si no está autenticado
      window.location.href = "/login";
    }
  }, [usuario]);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Subir y Administrar Fotos</h1>
      <SubirFotos
        usuarioId={usuarioId}
        onUploadSuccess={() => setActualizar(!actualizar)}
      />
      <ListarFotos usuarioId={usuarioId} key={actualizar} />
    </div>
  );
};

export default MisFotos;
