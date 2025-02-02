"use client";

import { useState } from "react";
import SubirFotos from "../componentes/SubirFotos";
import ListarFotos from "../componentes/ListarFotos";

const MisFotos = () => {
  const [actualizar, setActualizar] = useState(false);
  const usuarioId = "ID_DEL_USUARIO"; // Aquí debes reemplazarlo con el ID real del usuario autenticado

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
