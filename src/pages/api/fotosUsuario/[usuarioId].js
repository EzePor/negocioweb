export default async function handler(req, res) {
  const { usuarioId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  switch (req.method) {
    case "GET":
      return handleGet(req, res, usuarioId, token);
    case "DELETE":
      return handleDelete(req, res, usuarioId, token);
    default:
      return res.status(405).json({ mensaje: "Método no permitido" });
  }
}

async function handleGet(req, res, usuarioId, token) {
  try {
    console.log("🔍 Consultando fotos para usuario:", usuarioId);

    const response = await fetch(
      `http://localhost:2025/fotosUsuario/${usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    console.log("📄 Respuesta del backend:", data);

    if (!response.ok) {
      throw new Error(data.mensaje || `Error del servidor: ${response.status}`);
    }

    return res.status(200).json({
      fotos: data.fotos || [],
      total: data.total || 0,
    });
  } catch (error) {
    console.error("❌ Error al obtener fotos:", error);
    return res.status(500).json({
      mensaje: "Error al obtener las fotos",
      error: error.message,
    });
  }
}

async function handleDelete(req, res) {
  try {
    const { usuarioId } = req.query; // Usamos query en lugar de params
    const eliminarTodas = req.query.todas === "true";

    console.log("🚀 Entrada a handleDelete");
    console.log("👤 Usuario ID:", usuarioId);
    console.log("🗑️ Eliminar todas:", eliminarTodas);

    // Construir la URL del backend según el tipo de eliminación
    const url = eliminarTodas
      ? `http://localhost:2025/fotosUsuario/${usuarioId}/todas`
      : `http://localhost:2025/fotosUsuario/${usuarioId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || `Error del servidor: ${response.status}`);
    }

    return res.status(200).json({
      success: true,
      mensaje: eliminarTodas
        ? `Se eliminaron ${data.eliminadas || 0} fotos correctamente`
        : "Foto eliminada correctamente",
      eliminadas: data.eliminadas,
      ...data,
    });
  } catch (error) {
    console.error("❌ Error al eliminar foto(s):", error);
    return res.status(500).json({
      success: false,
      mensaje: error.message || "Error al eliminar las fotos",
    });
  }
}
