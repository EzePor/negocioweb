"use server";

export const ProductosFormActionHandler = async (formData, id = null) => {
  try {
    // Validar que formData tenga contenido
    if (!formData) {
      throw new Error("FormData está vacío");
    }

    // Convertir y validar datos
    const precio = Number(formData.get("precio"));
    const descuento = Number(formData.get("descuento"));
    const precioDescuento = Number(formData.get("precioDescuento"));

    if (isNaN(precio)) {
      throw new Error("El precio debe ser un número válido");
    }
    if (isNaN(descuento)) {
      throw new Error("El descuento debe ser un número válido");
    }
    if (isNaN(precioDescuento)) {
      throw new Error("El precio con descuento debe ser un número válido");
    }

    // Crear objeto con datos validados
    const datosProducto = {
      nombre: formData.get("nombre") || "",
      descripcion: formData.get("descripcion") || "",
      categoria: formData.get("categoria") || "",
      precio,
      imagen: formData.get("imagen"),
      descuento,
      precioDescuento,
    };

    // Log detallado
    console.log("FormData recibido:", {
      tieneContenido: !!formData,
      campos: Array.from(formData.entries()),
    });

    console.log("Datos procesados:", {
      id,
      ...datosProducto,
      precioTipo: typeof precio,
      precioValor: precio,
    });

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3000/api/productos/${id}`
      : `http://localhost:3000/api/productos`;

    // Crear nuevo FormData con datos validados
    const validatedFormData = new FormData();
    Object.entries(datosProducto).forEach(([key, value]) => {
      // Convertir valores numéricos a cadenas antes de agregar al FormData
      if (value !== undefined && value !== null) {
        validatedFormData.append(
          key,
          typeof value === "number" ? value.toString() : value
        );
      }
    });

    const response = await fetch(url, {
      method,
      body: validatedFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error del servidor: ${response.status} - ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error completo:", error);
    throw error;
  }
};
