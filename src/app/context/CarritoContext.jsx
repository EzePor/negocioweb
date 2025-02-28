"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Exportar el contexto
export const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [listaCompras, setListaCompras] = useState([]);

  // Calculamos la cantidad total aquí
  const cantidadTotal = listaCompras.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  useEffect(() => {
    const carritoGuardado = sessionStorage.getItem("carrito");
    if (carritoGuardado) {
      setListaCompras(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("carrito", JSON.stringify(listaCompras));
  }, [listaCompras]);

  // Agregar función estaEnCarrito
  const estaEnCarrito = (productoId) => {
    return listaCompras.some((item) => item._id === productoId);
  };

  const agregarAlCarrito = (producto) => {
    setListaCompras((prev) => {
      const existe = prev.find((item) => item._id === producto._id);
      if (existe) {
        return prev.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
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

  const vaciarCarrito = () => {
    setListaCompras([]);
    localStorage.removeItem("carrito");
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
        vaciarCarrito,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
