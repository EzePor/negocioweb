"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <Link
        href="/productos/crearproducto"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Agregar Producto
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {productos.map((producto) => (
          <div key={producto._id} className="border p-4 rounded">
            <h2 className="text-xl">{producto.nombre}</h2>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <Link className="text-blue-500" href={`https://web.whatsapp.com/`}>
              <img
                src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
                alt="whatsapp"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
