// En el frontend
export async function procesarCompra(datosCompra) {
  try {
    const response = await fetch("http://localhost:3000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCompra),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response:", errorData);
      throw new Error(`Error en la respuesta: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al procesar compra:", error);
    throw error;
  }
}
