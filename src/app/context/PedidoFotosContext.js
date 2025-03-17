"use client";

import { createContext, useContext, useState, useEffect } from "react";

const PedidoFotosContext = createContext();

export const usePedidos = () => {
  const context = useContext(PedidoFotosContext);
  if (!context) {
    throw new Error("usePedidos debe ser usado dentro de PedidosProvider");
  }
  return context;
};

export const PedidoFotosProvider = ({ children }) => {
  const [pedidoActivo, setPedidoActivo] = useState(null);

  const registrarPedido = (pedido) => {
    setPedidoActivo(pedido);
    // Opcionalmente, guardar en localStorage
    localStorage.setItem("pedidoActivoFotos", JSON.stringify(pedido));
  };

  const limpiarPedido = () => {
    setPedidoActivo(null);
    localStorage.removeItem("pedidoActivoFotos");
  };

  return (
    <PedidoFotosContext.Provider
      value={{
        pedidoActivo,
        registrarPedido,
        limpiarPedido,
        esFotoEnPedido: !!pedidoActivo,
      }}
    >
      {children}
    </PedidoFotosContext.Provider>
  );
};
