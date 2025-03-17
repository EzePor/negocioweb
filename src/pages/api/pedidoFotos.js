export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "No autorizado" });
  }

  try {
    console.log("📝 API: Procesando pedido de fotos:", req.body);

    // Cambiamos la URL del backend
    const response = await fetch("http://localhost:2025/pedidoFotos/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    // Verificamos primero si la respuesta es OK antes de intentar parsear el JSON
    if (!response.ok) {
      const error = await response.text();
      console.error("❌ API: Error del backend:", {
        status: response.status,
        error,
      });
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API: Pedido creado exitosamente:", data);

    res.status(201).json(data);
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({
      mensaje: "Error al procesar el pedido",
      error: error.message,
    });
  }
}
