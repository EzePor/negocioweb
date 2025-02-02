"use client";

import { useState } from "react";

const SubirFotos = ({ usuarioId, onUploadSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!archivo) return alert("Selecciona una imagen");

    const formData = new FormData();
    formData.append("imagen", archivo);
    formData.append("usuarioId", usuarioId);

    setCargando(true);
    try {
      const response = await fetch("/api/fotos-usuario/subir", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Foto subida con éxito");
        onUploadSuccess(); // Refresca la lista de fotos
      } else {
        alert("Error al subir la foto");
      }
    } catch (error) {
      alert("Error en la subida");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={cargando}>
        {cargando ? "Subiendo..." : "Subir Foto"}
      </button>
    </div>
  );
};

export default SubirFotos;
