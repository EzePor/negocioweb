"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const { agregarAlCarrito, quitarDelCarrito, estaEnCarrito } = useCarrito();
  const { usuario } = useContext(AuthContext);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const categorias = [
    "Todos",
    "Relojes",
    "Auriculares",
    "Fundas",
    "SmartWatch",
    "Cargadores",
    "Álbumes",
    "Portarretratos",
    "Almacenamiento",
  ];

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

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="container mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Explora Nuestros Productos
      </h1>

      {/* Contenedor con barra lateral y productos */}
      <div className="flex gap-6">
        {/* Barra lateral */}
        <aside className="w-1/4 hidden md:block bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Categorías
          </h2>
          <ul>
            {categorias.map((categoria) => (
              <li key={categoria} className="mb-2">
                <button
                  onClick={() => setCategoriaSeleccionada(categoria)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    categoriaSeleccionada === categoria
                      ? "bg-orange-500 text-white"
                      : "hover:bg-orange-100 text-gray-700"
                  }`}
                >
                  {categoria}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Contenedor de productos */}
        <div className="w-full md:w-3/4">
          {/* Barra de búsqueda */}
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Lista de productos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => {
                const agregado = estaEnCarrito(producto._id);
                return (
                  <div
                    key={producto._id}
                    className="bg-white border rounded-lg shadow-lg p-4 transition transform hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Imagen con evento de clic para abrir modal */}
                    <div
                      className="relative overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setImagenSeleccionada(producto.imagen)}
                    >
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-48 object-cover rounded-lg transform transition duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Información del producto */}
                    <div className="mt-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        {producto.nombre}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {producto.descripcion}
                      </p>

                      {producto.descuento > 0 ? (
                        <div className="mt-2 flex">
                          <span className="text-gray-500 line-through text-lg">
                            ${producto.precio.toFixed(2)}
                          </span>
                          <span className="ml-4 text-sm bg-lime-600 text-white px-2 py-1 rounded-md">
                            -{producto.descuento}%
                          </span>
                          <div className="text-2xl font-semibold text-lime-700  ml-8">
                            ${producto.precioDescuento.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xl font-semibold text-gray-800 block mt-2">
                          ${producto.precio.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Botones de acción */}
                    {usuario && (
                      <div className="mt-4 flex justify-between items-center">
                        {agregado ? (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition hover:bg-red-600"
                            onClick={() => quitarDelCarrito(producto._id)}
                          >
                            Quitar del carrito
                          </button>
                        ) : (
                          <button
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition hover:bg-orange-600 hover:scale-105"
                            onClick={() => agregarAlCarrito(producto)}
                          >
                            Agregar al carrito
                          </button>
                        )}
                        <Link href="https://web.whatsapp.com/">
                          <img
                            src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
                            alt="whatsapp"
                            className="w-10 h-10"
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center w-full col-span-3 text-gray-500">
                No hay productos que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Imagen Ampliada */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div className="relative">
            {/* Botón de cerrar */}
            <button
              className="absolute top-0 right-0 m-4 text-white bg-gray-700 hover:bg-gray-900 px-3 py-1 rounded-full text-lg"
              onClick={() => setImagenSeleccionada(null)}
            >
              ✖
            </button>

            {/* Imagen ampliada */}
            <img
              src={imagenSeleccionada}
              alt="Producto ampliado"
              className="w-[90vw] md:w-[50vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
