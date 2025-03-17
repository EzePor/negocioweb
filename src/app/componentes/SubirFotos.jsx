"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { subirFotos, subirImagenes } from "@/server/actions/fotosUsuario";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const SubirFotos = ({ onUploadSuccess }) => {
  // Removemos usuarioId de props
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { usuario, token, isClient } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const inputRef = useRef(null);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const verificarAuth = async () => {
      try {
        // Intentar obtener usuario del localStorage si no está en el contexto
        const storedUserData = localStorage.getItem("usuario");
        const usuarioActual =
          usuario || (storedUserData ? JSON.parse(storedUserData) : null);

        console.log("🔍 Verificando autenticación:", {
          usuarioContexto: usuario,
          usuarioLocalStorage: storedUserData
            ? JSON.parse(storedUserData)
            : null,
          usuarioActual,
        });

        if (!usuarioActual?._id) {
          throw new Error("No se encontró información del usuario");
        }
      } catch (error) {
        console.error("❌ Error en verificación:", error);
        await Swal.fire({
          title: "Error de Autenticación",
          text: "Por favor, inicia sesión nuevamente",
          icon: "warning",
        });
        window.location.href = "/login";
      }
    };

    if (isClient) {
      verificarAuth();
    }
  }, [usuario, isClient]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setError("Por favor, selecciona al menos una imagen");
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setError("Por favor, selecciona solo archivos de imagen");
      return;
    }

    setArchivos(imageFiles);
    setError(null);
  };

  const handleUpload = async () => {
    try {
      if (!archivos || archivos.length === 0) {
        throw new Error("Por favor, selecciona al menos una imagen");
      }

      if (!usuario?.id) {
        throw new Error("No se encontró información del usuario");
      }

      setCargando(true);
      setError(null);

      // Preparar FormData
      const formData = new FormData();
      formData.append("usuarioId", usuario.id);

      // Agregar cada archivo
      archivos.forEach((archivo) => {
        formData.append("imagenes", archivo);
      });

      console.log("📤 Enviando", archivos.length, "archivos...");

      const resultado = await subirImagenes(formData);

      if (!resultado.success) {
        throw new Error(resultado.mensaje);
      }

      console.log("✅ Imágenes subidas:", resultado);

      // Limpiar y actualizar
      setArchivos([]);
      setMensajeExito("Imágenes subidas correctamente");
      if (onUploadSuccess) {
        onUploadSuccess(resultado.datos);
      }
    } catch (error) {
      console.error("❌ Error al subir imágenes:", error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Subir Imagen</h2>

      {mensajeExito && (
        <div className="mt-2 p-2 bg-green-100 text-green-700 rounded">
          {mensajeExito}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {cargando && (
        <div className="mt-2 flex items-center">
          <div className="animate-spin mr-2">⌛</div>
          <span>Subiendo imágenes...</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col">
          <input
            type="file"
            name="imagenes"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded p-2"
          />
          {archivos.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {archivos.length}{" "}
              {archivos.length === 1
                ? "archivo seleccionado"
                : "archivos seleccionados"}
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={cargando || !archivos.length === 0}
          className={`
            w-full py-2 px-4 rounded-md text-white font-medium
            ${
              cargando || !archivos.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transition-colors"
            }
          `}
        >
          {cargando ? "Subiendo..." : "Subir Imagen"}
        </button>
      </div>
    </div>
  );
};

export default SubirFotos;
