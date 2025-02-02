"use client";

import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCarrito } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext"; // Importamos el contexto de autenticación

const NavBar = () => {
  const [isClick, setIsClick] = useState(true);
  const { usuario, logout } = useContext(AuthContext); // Obtenemos usuario y logout del contexto
  const cantidadTotal = useCarrito();

  useEffect(() => {
    console.log("Usuario en Navbar (useEffect):", usuario);
  }, [usuario]);

  const handleNavBar = () => setIsClick(!isClick);

  return (
    <header className="flex items-center justify-center">
      <nav className="bg-zinc-900 w-full fixed top-0 z-50 h-16 lg:h-20 flex items-center">
        {/* Contenedor principal */}
        <div className="flex justify-between w-full px-4 lg:px-12 items-center">
          {/* Logo y botón menú */}
          <div className="flex items-center">
            <button
              className="lg:hidden text-white text-2xl"
              onClick={handleNavBar}
              aria-label="Abrir menú"
            >
              {isClick ? <FaBars /> : <FaTimes />}
            </button>
            <Link href="/">
              <img
                src="./next.svg"
                alt="Logo Negocio Web"
                className="h-10 ml-4 rounded-md bg-white"
              />
            </Link>
          </div>

          {/* Menú principal para pantallas grandes */}
          <ul className="hidden lg:flex space-x-8 text-white font-semibold">
            {[
              { name: "Productos", href: "/productos" },
              {
                name: "Impresiones Fotográficas",
                href: "/impresionesdigitales",
              },
              {
                name: "Albumes y Portarretratos",
                href: "/albumesPortarretratos",
              },
              { name: "Información", href: "/informacion" },
              { name: "Contacto", href: "/contacto" },
              { name: "Admin", href: "/adminproductos" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-orange-400 focus:text-orange-400 border-b-2 border-transparent focus:border-orange-500"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Íconos del carrito y usuario */}
          <div className="flex items-center space-x-6">
            <Link href="/carrito" aria-label="Carrito de compras">
              <div className="relative">
                <FaShoppingCart className="text-white text-2xl" />
                {cantidadTotal > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cantidadTotal}
                  </span>
                )}
              </div>
            </Link>

            {usuario ? (
              <div className="text-white flex items-center space-x-4">
                <span>{usuario.nombre}</span>
                <button
                  onClick={logout}
                  className="bg-orange-600 px-3 py-1 rounded text-sm hover:bg-orange-500"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link href="/login" aria-label="Perfil de usuario">
                <FaUserCircle className="text-white text-2xl" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Menú desplegable móvil */}
      {!isClick && (
        <div className="fixed top-16 left-0 w-full bg-zinc-900 text-white z-40">
          <ul className="flex flex-col space-y-4 p-4">
            {[
              { name: "Productos", href: "/productos" },
              {
                name: "Impresiones Fotográficas",
                href: "/impresionesdigitales",
              },
              {
                name: "Albumes y Portarreratos",
                href: "/albumesPortarretratos",
              },
              { name: "Información", href: "/informacion" },
              { name: "Contacto", href: "/contacto" },
              { name: "Admin", href: "/adminproductos" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block py-2 px-4 hover:bg-orange-600 rounded"
                  onClick={handleNavBar}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default NavBar;
