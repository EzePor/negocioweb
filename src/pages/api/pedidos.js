export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  try {
    const { usuario, carrito, total } = req.body;
    console.log("👉 Paso 1 - Datos recibidos:", { usuario, carrito, total });

    // Validación de datos
    if (!usuario?.nombre || !usuario?.email || !carrito?.length || !total) {
      console.log("❌ Error de validación:", {
        tieneNombre: !!usuario?.nombre,
        tieneEmail: !!usuario?.email,
        carritoLength: carrito?.length,
        tieneTotal: !!total,
      });
      return res.status(400).json({
        mensaje: "Datos incompletos",
        detalles: {
          usuario: !!usuario,
          carritoLength: carrito?.length,
          total: !!total,
        },
      });
    }

    console.log("👉 Paso 2 - Intentando conectar con backend");

    // Actualizar la ruta para que coincida con el backend
    const response = await fetch(
      "http://localhost:2025/pedidos/procesar-compra",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          usuario,
          carrito: carrito.map((item) => ({
            id: item._id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
          total,
        }),
      }
    );

    console.log("👉 Paso 3 - Status del backend:", response.status);

    const responseText = await response.text();
    console.log("👉 Paso 4 - Respuesta raw:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("👉 Paso 5 - Datos parseados:", data);
    } catch (e) {
      console.error("❌ Error al parsear JSON:", e);
      console.error("Texto recibido:", responseText);
      throw new Error("Respuesta inválida del servidor");
    }

    if (!response.ok) {
      console.error("❌ Error del backend:", data);
      throw new Error(data.mensaje || `Error del servidor: ${response.status}`);
    }

    console.log("✅ Éxito - Enviando respuesta al cliente");
    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error completo:", error);
    return res.status(500).json({
      mensaje: "Error al procesar la compra",
      error: error.message,
    });
  }
}
