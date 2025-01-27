"use client";

import { useRef } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ProductoFormAgregar({ handler }) {
  const formRef = useRef(null);

  const formAction = async (event) => {
    event.preventDefault(); // Prevenir comportamiento por defecto

    try {
      const formData = new FormData(formRef.current);

      // Log para debug
      console.log("Datos del formulario:", {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        categoria: formData.get("categoria"),
        precio: formData.get("precio"),
        imagen: formData.get("imagen"),
        descuento: formData.get("descuento"),
        precioDescuento: formData.get("precioDescuento"),
      });

      const response = await handler(formData);
      if (response && response._id) {
        Swal.fire({
          text: `Producto ${response.nombre}, creado con éxito`,
          icon: "success",
          confirmButtonColor: "#5cb85c",
          confirmButtonText: "Aceptar",
        }).then(() => {
          window.location.href = "/productos";
        });
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire({
        text: error.message,
        icon: "error",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="container mt-14 m-auto w-[80%] ">
      <div className="flex justify-between items-center">
        <form
          ref={formRef}
          onSubmit={formAction}
          className="flex flex-col space-y-4"
        >
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            className="border border-gray-300 rounded-md p-2"
          />

          <label htmlFor="descripcion">Descripción del Producto</label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            className="border border-gray-300 rounded-md p-2"
          ></textarea>

          <label htmlFor="categoria">Categoría del Producto</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            required
            className="border border-gray-300 rounded-md p-2"
          />

          <label htmlFor="precio">Precio del Producto</label>
          <input
            type="number"
            id="precio"
            name="precio"
            required
            className="border border-gray-300 rounded-md p-2"
          />

          <label htmlFor="imagen">Imagen del Producto</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            required
            className="border border-gray-300 rounded-md p-2"
          />

          <label htmlFor="descuento">Descuento del Producto</label>
          <input
            type="number"
            id="descuento"
            name="descuento"
            className="border border-gray-300 rounded-md p-2"
          />
          <label htmlFor="precioDescuento">Precio con Descuento</label>
          <input
            type="number"
            id="precioDescuento"
            name="precioDescuento"
            className="border border-gray-300 rounded-md p-2"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md"
          >
            Agregar Producto
          </button>
        </form>
        <div className="flex flex-col space-y-4">
          <Link href="/adminproductos">
            <button className="bg-lime-400 border-spacing-1 rounded-2xl px-8 py-4 font-extrabold text-2xl text-white">
              Productos
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
