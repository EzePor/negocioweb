"use client";

import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";

const Carrito = () => {
  const { listaCompras, aumentarCantidad, disminuirCantidad, eliminarCompra } =
    useContext(CarritoContext);

  const calcularTotal = () => {
    return listaCompras
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  const handleImpresion = () => {
    print();
  };

  return (
    <div className="container mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
      {listaCompras.length > 0 ? (
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <span>{item.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">${item.precio.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded-l"
                        onClick={() => disminuirCantidad(item._id)}
                      >
                        -
                      </button>
                      <span className="px-4">{item.cantidad}</span>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-r"
                        onClick={() => aumentarCantidad(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => eliminarCompra(item._id)}
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
          <div className="text-center mt-4">
            <button
              className={`${
                listaCompras.length > 0
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white font-bold py-2 px-4 rounded`}
              onClick={handleImpresion}
              disabled={listaCompras.length < 1}
            >
              Comprar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">El carrito está vacío.</p>
      )}
    </div>
  );
};

export default Carrito;
