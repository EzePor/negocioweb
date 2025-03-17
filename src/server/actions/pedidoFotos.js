export const crearPedidoFotos = async (datosPedido) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No hay token disponible");
    }

    console.log("📝 Enviando pedido:", datosPedido);

    const response = await fetch("/api/pedidoFotos", {
      // Cambiamos la ruta
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosPedido),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        throw new Error(error.mensaje || "Error al crear el pedido");
      } else {
        throw new Error(`Error del servidor: ${response.status}`);
      }
    }

    const data = await response.json();
    return {
      success: true,
      numeroPedido: data.datos.numeroOrden,
      mensaje: data.mensaje,
    };
  } catch (error) {
    console.error("❌ Error al crear pedido:", error);
    return {
      success: false,
      mensaje: error.message,
    };
  }
};
