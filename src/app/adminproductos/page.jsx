"use client";

import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

export default function AdminProductosPage() {
  const [productos, setProductos] = useState([]);
  const { usuario } = useContext(AuthContext);

  // Redirigir si el usuario no está autenticado o no tiene rol de admin
  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      window.Location.href = "/login"; // Redirigir a login si no es admin
    }
  }, [usuario]);

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

  // Mientras se verifica la autenticación, mostrar un loader o nada
  if (!usuario || usuario.rol !== "admin") {
    return <p className="text-center mt-20 text-lg">Redirigiendo...</p>;
  }

  return (
    <div className="container  mx-auto mt-20 px-4">
      <div className="flex justify-around items-center ">
        <h1 className="text-4xl bg-blue-600 text-white p-2 m-2 font-bold mb-4">
          Productos
        </h1>
        <Link
          href="/productos/crearproducto"
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
        >
          Agregar Producto
        </Link>
      </div>
      <div className="flex justify-between items-center">
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
              <Link href={`adminproductos/${producto._id}/actualizar_producto`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl">
                  Editar Producto
                </button>
              </Link>
              <Link href={`eliminar/${producto._id}`}>
                <button className="bg-red-500 text-white px-4 py-2 rounded-2xl">
                  Eliminar Producto
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
