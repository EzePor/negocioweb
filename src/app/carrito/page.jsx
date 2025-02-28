"use client";

import React, { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { useCarrito } from "../context/CarritoContext";
import FormularioCompra from "../componentes/FormularioCompra";
import Swal from "sweetalert2";
import { procesarCompra } from "@/server/actions/pedidos";

const Carrito = () => {
  const { listaCompras, aumentarCantidad, disminuirCantidad, eliminarCompra } =
    useContext(CarritoContext);
  const { vaciarCarrito } = useCarrito();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const [datosCompra, setDatosCompra] = useState(null);

  const calcularTotal = () => {
    return listaCompras
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const handleCompra = () => {
    setMostrarFormulario(true);
  };

  const handleFinalizarCompra = async (datosUsuario) => {
    const datosCompletos = {
      usuario: datosUsuario,
      carrito: listaCompras,
      total: calcularTotal(),
    };
    setDatosCompra(datosCompletos);
    setCompraFinalizada(true);

    // Llamar a confirmarCompra pasando los datos directamente
    // confirmarCompra(datosCompletos);
  };

  const confirmarCompraFinal = async () => {
    try {
      // Mostrar loader mientras procesa
      Swal.fire({
        title: "Procesando tu compra",
        html: "Por favor espera un momento...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      console.log("📝 Datos de compra a enviar:", datosCompra);
      const resultado = await procesarCompra(datosCompra);
      console.log("✅ Respuesta del servidor:", resultado);

      // Cerrar el loader
      Swal.close();

      // Mostrar confirmación
      await Swal.fire({
        title: "¡Compra realizada!",
        text: `Tu compra ha sido confirmada. Código: ${resultado.orderId}`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Limpiar datos
      vaciarCarrito();
      setCompraFinalizada(false);
      setMostrarFormulario(false);
      setDatosCompra(null);
      sessionStorage.removeItem("carrito");

      // Redireccionar
      window.location.href = "/productos";
    } catch (error) {
      console.error("❌ Error en la compra:", error);

      // Cerrar el loader y mostrar error
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo procesar la compra",
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>

      {listaCompras.length > 0 ? (
        <div className="overflow-x-auto">
          {/* 🛒 Mantener la tabla del carrito visible */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">
                  Precio
                </th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600 uppercase">
                  Cantidad
                </th>
                <th className="px-4 py-2 text-center font-semibold text-gray-600 uppercase">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {listaCompras.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="px-4 py-2 flex items-center space-x-4">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <span>{item.nombre}</span>
                  </td>
                  <td className="px-4 py-2">${item.precio.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        className={`bg-orange-500 text-white font-bold py-1 px-2 rounded-l ${
                          compraFinalizada
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-orange-700"
                        }`}
                        onClick={() => disminuirCantidad(item._id)}
                        disabled={compraFinalizada}
                      >
                        -
                      </button>
                      <span className="px-4">{item.cantidad}</span>
                      <button
                        className={`bg-blue-500 text-white font-bold py-1 px-2 rounded-r ${
                          compraFinalizada
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-700"
                        }`}
                        onClick={() => aumentarCantidad(item._id)}
                        disabled={compraFinalizada}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className={`bg-red-500 text-white font-bold py-1 px-2 rounded ${
                        compraFinalizada
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-700"
                      }`}
                      onClick={() => eliminarCompra(item._id)}
                      disabled={compraFinalizada}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold text-xl" colSpan="2">
                  Total:
                </td>
                <td className="px-4 py-2 font-bold text-xl text-center">
                  $ {calcularTotal()}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {compraFinalizada && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm text-center">
              El carrito está bloqueado mientras revisa su compra. Para
              modificar productos, use el botón "Modificar Datos" abajo.
            </div>
          )}

          {/* 🟢 Botón de comprar */}
          {!mostrarFormulario && !compraFinalizada && (
            <div className="text-center mt-4">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCompra}
              >
                Comprar
              </button>
            </div>
          )}

          {/* 📋 Mostrar el formulario debajo del carrito */}
          {mostrarFormulario && !compraFinalizada && (
            <FormularioCompra
              carrito={listaCompras}
              total={calcularTotal()}
              onFinalizarCompra={handleFinalizarCompra}
            />
          )}

          {/* 📝 Resumen de compra */}
          {compraFinalizada && (
            <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-3">
                  Resumen de Compra
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Datos del usuario */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Datos del Comprador
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(datosCompra.usuario).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center border-b border-gray-100 pb-2"
                      >
                        <span className="text-gray-600 font-medium capitalize w-24">
                          {key}:
                        </span>
                        <span className="text-gray-800 ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detalles del carrito */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Productos
                  </h3>
                  <ul className="divide-y divide-gray-100">
                    {datosCompra.carrito.map((item) => (
                      <li
                        key={item._id}
                        className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="ml-3">
                            <p className="text-gray-800 font-medium">
                              {item.nombre}
                            </p>
                            <p className="text-gray-500 text-sm">
                              Cantidad: {item.cantidad}
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-700 font-semibold">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${datosCompra.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() => {
                    setCompraFinalizada(false);
                    setMostrarFormulario(true);
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Modificar Datos
                </button>
                <button
                  onClick={confirmarCompraFinal}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center"
                >
                  Finalizar Compra
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">El carrito está vacío.</p>
      )}
    </div>
  );
};

export default Carrito;
