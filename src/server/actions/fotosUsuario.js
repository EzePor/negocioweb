export async function subirFotos(formData) {
  try {
    console.log("📦 Iniciando subida de fotos...");

    // Debug del FormData
    console.log("📄 Contenido del FormData:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File {
          name: ${value.name},
          type: ${value.type},
          size: ${value.size} bytes
        }`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const response = await fetch("/api/fotosUsuario", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${formData.get("token")}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("📨 Respuesta del servidor:", data);

    if (!response.ok) {
      throw new Error(data.mensaje || `Error: ${response.status}`);
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error("❌ Error en subirFotos:", error);
    return {
      success: false,
      mensaje: error.message || "Error al procesar la imagen",
    };
  }
}

export async function subirImagenes(formData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token no disponible");
    }

    console.log("📤 Preparando envío de imágenes...");

    const archivos = formData.getAll("imagenes");
    console.log(`📁 Archivos a enviar: ${archivos.length}`);

    // Verificar tamaño y tipo de archivos
    for (const archivo of archivos) {
      if (archivo.size > 10 * 1024 * 1024) {
        // 10MB límite
        throw new Error(`El archivo ${archivo.name} excede el límite de 10MB`);
      }
      if (!archivo.type.startsWith("image/")) {
        throw new Error(`El archivo ${archivo.name} no es una imagen válida`);
      }
    }

    const response = await fetch("http://localhost:2025/fotosUsuario/subir", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.mensaje || `Error del servidor: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("✅ Respuesta del servidor:", data);

    return {
      success: true,
      mensaje: "Imágenes subidas correctamente",
      datos: data.fotos || [],
    };
  } catch (error) {
    console.error("❌ Error en subirImagenes:", error);
    return {
      success: false,
      mensaje: error.message || "Error al procesar las imágenes",
    };
  }
}

export async function obtenerFotos(usuarioId) {
  try {
    console.log("📂 Solicitando fotos para usuario:", usuarioId);

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    const response = await fetch(`/api/fotosUsuario/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || `Error: ${response.status}`);
    }

    return {
      success: true,
      fotos: Array.isArray(data.fotos) ? data.fotos : [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("❌ Error al obtener fotos:", error);
    return {
      success: false,
      fotos: [],
      total: 0,
      mensaje: error.message,
    };
  }
}

export async function eliminarFoto(fotoId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    const response = await fetch(`/api/fotosUsuario/${fotoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || `Error: ${response.status}`);
    }

    return {
      success: true,
      mensaje: "Foto eliminada correctamente",
    };
  } catch (error) {
    console.error("❌ Error al eliminar foto:", error);
    return {
      success: false,
      mensaje: error.message,
    };
  }
}
export async function eliminarTodasLasFotos(usuarioId) {
  try {
    console.log("🗑️ Iniciando eliminación de todas las fotos...");

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    if (!usuarioId) {
      throw new Error("ID de usuario no proporcionado");
    }

    console.log("📤 Eliminando fotos para usuario:", usuarioId);

    // Agregamos el parámetro todas=true para indicar eliminación masiva
    const response = await fetch(`/api/fotosUsuario/${usuarioId}?todas=true`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Manejar respuesta
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || `Error del servidor: ${response.status}`
        );
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("✅ Respuesta del servidor:", data);

    if (!data.success) {
      throw new Error(data.mensaje || "Error al eliminar las fotos");
    }

    return {
      success: true,
      mensaje: data.mensaje || "Fotos eliminadas correctamente",
      eliminadas: data.eliminadas || 0,
    };
  } catch (error) {
    console.error("❌ Error al eliminar todas las fotos:", error);
    return {
      success: false,
      mensaje: error.message || "Error al eliminar las fotos",
    };
  }
}

export const descargarFoto = async (fotoId, nombreOriginal) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    // Verificar el rol del usuario
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "admin") {
      throw new Error("Solo los administradores pueden descargar fotos");
    }

    console.log("📥 Iniciando descarga de foto:", fotoId);

    const response = await fetch(
      `/api/fotosUsuario/descargarIndividual/${fotoId}`, // Ruta corregida
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || `Error ${response.status}`);
      } else {
        throw new Error(`Error al descargar: ${response.status}`);
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreOriginal || `foto_${fotoId}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("❌ Error al descargar foto:", error);
    return { success: false, mensaje: error.message };
  }
};

export const descargarTodasLasFotos = async (usuarioId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    // Verificar el rol del usuario
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.rol !== "admin") {
      throw new Error("Solo los administradores pueden descargar fotos");
    }

    console.log("📥 Iniciando descarga masiva para usuario:", usuarioId);

    const response = await fetch(
      `/api/fotosUsuario/descargarTodas/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || `Error al descargar: ${response.status}`
        );
      } else {
        throw new Error(`Error al descargar: ${response.status}`);
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `fotos_usuario_${usuarioId}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true }; // Agregamos el retorno explícito del éxito
  } catch (error) {
    console.error("❌ Error al descargar fotos:", error);
    return { success: false, mensaje: error.message };
  }
};
