export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  const { usuarioId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    console.log("📥 Descargando todas las fotos del usuario:", usuarioId);

    const response = await fetch(
      `http://localhost:2025/fotosUsuario/descargarTodas/${usuarioId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al descargar: ${response.status}`);
    }

    const blob = await response.blob();

    // Configurar headers para descarga del ZIP
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fotos_usuario_${usuarioId}.zip`
    );

    // Enviar el archivo ZIP
    res.send(Buffer.from(await blob.arrayBuffer()));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      mensaje: "Error al descargar las fotos",
      error: error.message,
    });
  }
}
