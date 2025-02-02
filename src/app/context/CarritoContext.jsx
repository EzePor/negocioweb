"use client";

import { createContext, useContext, useState } from "react";

// Exportar el contexto
export const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [listaCompras, setListaCompras] = useState([]);

  // Agregar función estaEnCarrito
  const estaEnCarrito = (productoId) => {
    return listaCompras.some((item) => item._id === productoId);
  };

  const agregarAlCarrito = (producto) => {
    setListaCompras((prev) => [...prev, { ...producto, cantidad: 1 }]);
  };

  const quitarDelCarrito = (productoId) => {
    setListaCompras((prev) => prev.filter((item) => item._id !== productoId));
  };

  const aumentarCantidad = (productoId) => {
    setListaCompras((prev) =>
      prev.map((item) =>
        item._id === productoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (productoId) => {
    setListaCompras((prev) =>
      prev.map((item) =>
        item._id === productoId && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  const eliminarCompra = (productoId) => {
    setListaCompras((prev) => prev.filter((item) => item._id !== productoId));
  };

  return (
    <CarritoContext.Provider
      value={{
        listaCompras,
        estaEnCarrito,
        agregarAlCarrito,
        quitarDelCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
