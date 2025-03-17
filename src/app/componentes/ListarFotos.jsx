"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  obtenerFotos,
  eliminarFoto,
  descargarFoto,
  descargarTodasLasFotos,
  eliminarTodasLasFotos,
} from "@/server/actions/fotosUsuario";
import Image from "next/image";
import FormularioPedido from "./FormularioPedidoFotos";
import { crearPedidoFotos } from "@/server/actions/pedidoFotos";
import { usePedidos } from "../context/PedidoFotosContext";

const ListarFotos = () => {
  const [fotos, setFotos] = useState([]);
  const [totalFotos, setTotalFotos] = useState(0);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null); // Nuevo estado para mensajes
  const { usuario } = useContext(AuthContext);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [descargando, setDescargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { pedidoActivo, esFotoEnPedido, registrarPedido, limpiarPedido } =
    usePedidos();

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        if (!usuario?.id) {
          console.warn("⚠️ No hay ID de usuario disponible");
          return;
        }

        console.log("📥 Solicitando fotos para usuario:", usuario.id);

        const resultado = await obtenerFotos(usuario.id);

        if (resultado.success) {
          setFotos(resultado.fotos);
          setTotalFotos(resultado.fotos.length);
          console.log("📸 Fotos actualizadas:", resultado.fotos.length);
        } else {
          throw new Error(resultado.mensaje);
        }
      } catch (error) {
        console.error("❌ Error al obtener fotos:", error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchFotos();
  }, [usuario?.id, esFotoEnPedido]); // Añadimos esFotoEnPedido como dependencia

  // Nuevo useEffect para manejar tecla Escape y scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setImagenSeleccionada(null);
      }
    };

    if (imagenSeleccionada) {
      // Agregar event listener cuando hay imagen seleccionada
      document.addEventListener("keydown", handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [imagenSeleccionada]);

  const handleDescargarFoto = async (foto) => {
    try {
      const resultado = await descargarFoto(foto._id, foto.nombreOriginal);
      if (!resultado.success) {
        throw new Error(resultado.mensaje);
      }
      setMensaje("✅ Foto descargada correctamente");
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("❌ Error en la descarga:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDescargarTodas = async () => {
    try {
      setDescargando(true);
      const resultado = await descargarTodasLasFotos(usuario.id);

      if (!resultado?.success) {
        // Agregamos verificación con optional chaining
        throw new Error(resultado?.mensaje || "Error al descargar las fotos");
      }

      setMensaje("✅ Fotos descargadas correctamente");
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error("❌ Error al descargar fotos:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDescargando(false);
    }
  };

  const handleEliminarFoto = async (fotoId, nombreFoto = "imagen") => {
    try {
      const resultado = await eliminarFoto(fotoId);
      if (resultado.success) {
        setFotos(fotos.filter((foto) => foto._id !== fotoId));
        // Actualizar el contador
        setTotalFotos((prev) => prev - 1);
        setMensaje(
          `✅ El archivo "${nombreFoto}" ha sido eliminada correctamente`
        );
        setTimeout(() => setMensaje(null), 3000);
      } else {
        throw new Error(resultado.mensaje);
      }
    } catch (error) {
      console.error("❌ Error al eliminar la foto:", error);
      setError(error.message);
    }
  };

  const handleSubmitPedido = async (datosPedido) => {
    try {
      console.log(
        "🚀 ListarFotos: Iniciando proceso de pedido...",
        datosPedido
      );

      // 1. Crear el pedido
      const resultado = await crearPedidoFotos({
        ...datosPedido,
        usuarioId: usuario.id,
        fotos: datosPedido.fotos.map((f) => f._id),
      });

      console.log("📨 Respuesta del servidor:", resultado);

      if (!resultado.success) {
        throw new Error(resultado.mensaje || "Error al crear el pedido");
      }

      // Verificar la estructura de la respuesta
      if (!resultado.numeroPedido) {
        console.error("❌ Respuesta incompleta:", resultado);
        throw new Error("No se recibió el número de orden del pedido");
      }

      // 2. Eliminar todas las fotos
      console.log("🗑️ ListarFotos: Eliminando fotos...");
      const eliminarResult = await eliminarTodasLasFotos(usuario.id);

      if (!eliminarResult.success) {
        console.error("❌ Error al eliminar fotos:", eliminarResult.mensaje);
      }

      // 3. Crear objeto del pedido completo
      const pedidoCompleto = {
        numeroPedido: resultado.numeroPedido,
        cantidadFotos: datosPedido.cantidadFotos,
        fechaCreacion: new Date().toISOString(),
        medidaFoto: datosPedido.medidaFoto,
        fotos: datosPedido.fotos.map((f) => ({
          _id: f._id,
          url: f.url,
          nombre: f.nombre || f.originalname,
        })),
      };

      // 4. Registrar el pedido activo en el contexto
      registrarPedido(pedidoCompleto);

      console.log("✅ Pedido completo creado:", pedidoCompleto);

      return pedidoCompleto;
    } catch (error) {
      console.error("❌ ListarFotos: Error en handleSubmitPedido:", error);
      throw error;
    }
  };

  if (cargando) {
    return <div className="text-center">Cargando fotos...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Si hay un pedido activo, mostramos la confirmación en lugar de las fotos
  if (pedidoActivo) {
    return (
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
          ¡Pedido Realizado con Éxito!
        </h2>
        <div className="space-y-4">
          <p className=" font-semibold text-center text-xl text-green-950">
            Tu pedido con número de {pedidoActivo.numeroPedido} ha sido
            registrado correctamente.
          </p>
          <p className="text-center">
            Recibiste un mail con los detalles del pedido.
          </p>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-bold mb-2 text-center text-xl">
              Detalles del Pedido:
            </h3>
            <ul className="space-y-2">
              <li className="font-semibold text-center">
                Cantidad de fotos: {pedidoActivo.cantidadFotos}
              </li>
              <li className="font-semibold text-center">
                Medida seleccionada: {pedidoActivo.medidaFoto}
              </li>
              <li className="font-semibold text-center">
                Fecha:{" "}
                {new Date(pedidoActivo.fechaCreacion).toLocaleDateString()}
              </li>
            </ul>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              limpiarPedido();
              setFotos([]); // Limpiar las fotos localmente también
              setTotalFotos(0);
              // redirigir la página a impresiones fotográficas
              window.location.href = "/impresionesdigitales";
            }}
          >
            Realizar Nuevo Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Mis Fotos</h2>
      <div className="flex items-center gap-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Total: {totalFotos}
        </span>
        {usuario?.rol === "admin" && fotos.length > 0 && (
          <button
            onClick={handleDescargarTodas}
            disabled={descargando}
            className={`
                px-4 py-2 rounded-md text-white
                ${
                  descargando
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }
                transition-colors flex items-center gap-2
              `}
          >
            {descargando ? (
              <>
                <span className="animate-spin">↻</span>
                Descargando...
              </>
            ) : (
              <>📥 Descargar Todas</>
            )}
          </button>
        )}
      </div>
      {/* Mensaje de confirmación */}
      {mensaje && (
        <div className="my-4 p-3 bg-green-100 text-green-700 text-center font-bold text-xl rounded-md border border-green-200">
          {mensaje}
        </div>
      )}
      {fotos.length === 0 ? (
        <p className=" text-center text-3xl text-indigo-600 font-extrabold mt-8">
          No hay fotos disponibles
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {fotos.map((foto) => (
            <div
              key={foto.id || foto.url}
              className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="aspect-square relative overflow-hidden rounded-lg w-full h-[150px] cursor-pointer"
                onClick={() => setImagenSeleccionada(foto.url)}
              >
                <Image
                  src={foto.url}
                  alt={foto.nombre || "Foto subida"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVigAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4cHRoaHSQrJiEwST4xMjAvMS0yOzxRPjc5TjktLkJZQkdOUXV3dXJMX0pASXBJQXf/2wBDARUXFx4aHjUcHDV3SDc3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </div>
              <div className="mt-2 flex flex-col space-y-1">
                <span className="text-xs text-gray-500">
                  {new Date(foto.createdAt).toLocaleDateString()}
                </span>
                <div className="flex justify-between gap-2">
                  {usuario?.rol === "admin" && (
                    <button
                      onClick={() => handleDescargarFoto(foto)}
                      className="text-xs bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 transition-colors flex-1"
                      disabled={descargando}
                    >
                      {descargando ? (
                        <span className="animate-spin">↻</span>
                      ) : (
                        "Descargar"
                      )}
                    </button>
                  )}
                  <button
                    onClick={() =>
                      handleEliminarFoto(
                        foto._id,
                        foto.originalname || foto.nombre || "imagen"
                      )
                    }
                    className="text-xs bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition-colors text-center flex-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fotos.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            ✓ Terminar Pedido
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <FormularioPedido
          cantidadFotos={fotos.length}
          fotosSeleccionadas={fotos}
          onCancel={() => setMostrarFormulario(false)}
          onSubmit={handleSubmitPedido} // Esta es la conexión clave
          onSuccess={(resultado) => {
            setMostrarFormulario(false);
            registrarPedido(resultado); // Esto activará la vista del pedido
            setFotos([]);
            setTotalFotos(0);
          }}
        />
      )}

      {/* Modal de Imagen Ampliada */}
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setImagenSeleccionada(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Evita que el click se propague
          >
            <button
              className="absolute top-0 right-0 m-4 text-white bg-gray-700 hover:bg-gray-900 px-3 py-1 rounded-full text-lg"
              onClick={() => setImagenSeleccionada(null)}
            >
              ✖
            </button>
            <Image
              src={imagenSeleccionada}
              alt="Foto ampliada"
              width={1200}
              height={800}
              className="max-w-[90vw] md:max-w-[70vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
              quality={100}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarFotos;
