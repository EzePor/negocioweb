"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const { agregarAlCarrito, quitarDelCarrito, estaEnCarrito } = useCarrito();
  const { usuario } = useContext(AuthContext);

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
    <div className="container mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {productos.map((producto) => {
          const agregado = estaEnCarrito(producto._id);

          return (
            <div key={producto._id} className="border p-4 rounded relative">
              <h2 className="text-xl">{producto.nombre}</h2>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-48 object-cover"
              />
              <p>{producto.descripcion}</p>

              {usuario ? (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center mb-2">
                  <span className="text-lg font-bold mr-2">
                    {producto.precio}
                  </span>
                  {agregado ? (
                    <button
                      type="button"
                      className="bg-red-500 text-white p-2 rounded-md"
                      onClick={() => quitarDelCarrito(producto._id)}
                    >
                      Quitar del carrito
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="bg-orange-500 text-white p-2 rounded-md hover:transition-transform transform hover:scale-125 hover:bg-lime-700"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al carrito
                    </button>
                  )}
                </div>
              ) : (
                <p></p>
              )}
              <Link
                className="text-blue-500"
                href={`https://web.whatsapp.com/`}
              >
                <img
                  src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
                  alt="whatsapp"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
