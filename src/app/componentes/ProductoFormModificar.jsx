"use client";

import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

export default function ProductoFormModificar({ id, handler }) {
  console.log("FormModificar", id);

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const formRef = useRef(null);

  console.log("FormModificar -id:{id}", id);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        console.log("Fetching producto con ID:", id);
        const response = await fetch(`/api/productos/${id}`);
        if (!response.ok) throw new Error("Error al obtener el producto");
        const data = await response.json();
        console.log("Producto obtenido:", data);
        setProducto(data);
      } catch (error) {
        console.error("Error fetching producto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducto();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!producto) return <div>Producto no encontrado</div>;

  const formAction = async (formData) => {
    try {
      const response = await handler(formData, producto._id);
      console.log("Respuesta del servidor:", response);

      if (response && response._id) {
        Swal.fire({
          text: `Producto ${response.nombre}, actualizado con éxito`,
          icon: "success",
        }).then(() => {
          window.location.href = "/adminproductos";
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!producto) {
    return <p>Cargando ...</p>;
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col space-y-4">
      <label htmlFor="nombre">Nombre del Producto</label>
      <input
        type="text"
        name="nombre"
        defaultValue={producto.nombre}
        className="border p-2"
      />
      <label htmlFor="descripcion">Descripción del Producto</label>
      <textarea
        name="descripcion"
        defaultValue={producto.descripcion}
        className="border p-2"
      />
      <label htmlFor="categoria">Categoría del Producto</label>
      <input
        type="text"
        name="categoria"
        defaultValue={producto.categoria}
        className="border p-2"
      />
      <label htmlFor="precio">Precio del Producto</label>
      <input
        type="number"
        name="precio"
        defaultValue={producto.precio}
        className="border p-2"
      />
      <label htmlFor="imagen">Imagen del Producto</label>
      {producto.imagen && (
        <div className="mb-2">
          <p>Imagen actual:</p>
          <img
            src={producto.imagen}
            alt="Imagen actual"
            className="h-32 w-32 object-cover border"
          />
        </div>
      )}
      <input type="file" name="imagen" className="border p-2" />

      <label htmlFor="descuento">Descuento del Producto</label>
      <input
        type="number"
        name="descuento"
        defaultValue={producto.descuento}
        className="border p-2"
      />
      <label htmlFor="precioDescuento">Precio con Descuento</label>
      <input
        type="number"
        name="precioDescuento"
        defaultValue={producto.precioDescuento}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Actualizar Producto
      </button>
    </form>
  );
}
