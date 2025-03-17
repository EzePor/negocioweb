export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  const { fotoId } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    console.log("📥 API: Iniciando descarga de foto:", fotoId);
    console.log("🔑 API: Token recibido:", token.substring(0, 15) + "...");

    const response = await fetch(
      `http://localhost:2025/fotosUsuario/descargar/${fotoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ API: Error del servidor:", {
        status: response.status,
        data: errorData,
      });
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    const contentDisposition = response.headers.get("content-disposition");

    console.log("✅ API: Headers recibidos:", {
      contentType,
      contentDisposition,
    });

    // Obtener los datos como ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Configurar headers de respuesta
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    if (contentDisposition) {
      res.setHeader("Content-Disposition", contentDisposition);
    }

    // Enviar los datos
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("❌ API: Error detallado:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      mensaje: "Error al descargar la foto",
      error: error.message,
    });
  }
}
