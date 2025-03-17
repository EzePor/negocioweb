"use client";

import { useState } from "react";
import { crearPedidoFotos } from "@/server/actions/pedidoFotos";
import { useAuth } from "@/app/context/AuthContext";

const MEDIDAS_FOTOS = ["7x10", "10x15", "13x18", "15x21", "20x30"];

const FormularioPedido = ({
  cantidadFotos,
  onCancel,
  onSubmit,
  fotosSeleccionadas = [],
  onSuccess,
}) => {
  const { usuario } = useAuth();
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    direccion: "",
    localidad: "",
    provincia: "",
    medidaFoto: "10x15", // valor por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensajeExito(null);
    setEnviando(true);

    try {
      if (!fotosSeleccionadas || fotosSeleccionadas.length === 0) {
        throw new Error("No hay fotos seleccionadas");
      }

      console.log("📝 Formulario: Iniciando proceso de pedido");

      const datosParaEnviar = {
        ...formData,
        cantidadFotos,
        fotos: fotosSeleccionadas,
      };

      const resultado = await onSubmit(datosParaEnviar);

      console.log("📨 Resultado del pedido:", resultado);

      if (!resultado?.numeroPedido) {
        console.error("❌ Respuesta inválida:", resultado);
        throw new Error("No se recibió confirmación del pedido");
      }

      setMensajeExito(
        `Pedido #${resultado.numeroPedido} creado exitosamente. Te enviamos un email con los detalles.`
      );

      // Esperar un momento antes de cerrar
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(resultado);
        }
        onCancel();
      }, 2000);
    } catch (error) {
      console.error("❌ Error en formulario:", error);
      setError(error.message || "Error al procesar el pedido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Finalizar Pedido</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-center rounded-md border border-red-200">
            {error}
          </div>
        )}

        {mensajeExito && (
          <div className="mb-4 p-3 bg-green-100 text-green-900 text-center rounded-md border border-green-200">
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                required
                className="w-full p-2 border rounded"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                required
                className="w-full p-2 border rounded"
                value={formData.apellido}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DNI</label>
              <input
                type="text"
                name="dni"
                required
                className="w-full p-2 border rounded"
                value={formData.dni}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                required
                className="w-full p-2 border rounded"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Localidad
              </label>
              <input
                type="text"
                name="localidad"
                required
                className="w-full p-2 border rounded"
                value={formData.localidad}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Provincia
              </label>
              <input
                type="text"
                name="provincia"
                required
                className="w-full p-2 border rounded"
                value={formData.provincia}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Medida de Fotos
              </label>
              <select
                name="medidaFoto"
                required
                className="w-full p-2 border rounded"
                value={formData.medidaFoto}
                onChange={handleChange}
              >
                {MEDIDAS_FOTOS.map((medida) => (
                  <option key={medida} value={medida}>
                    {medida}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Cantidad de Fotos
              </label>
              <input
                type="number"
                readOnly
                value={cantidadFotos}
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded ${
                enviando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white flex items-center gap-2`}
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <span className="animate-spin">↻</span> Procesando...
                </>
              ) : (
                "Confirmar Pedido"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPedido;
