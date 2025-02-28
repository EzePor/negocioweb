import { useState } from "react";

const FormularioCompra = ({ carrito, total, onFinalizarCompra }) => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
    dni: "",
    direccion: "",
    localidad: "",
    provincia: "",
  });

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  /* const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, carrito, total }),
      });

      const data = await response.json();
    } catch (error) {
      console.error("Error en la compra:", error);
    }
  };*/

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar campos
    if (!Object.values(usuario).every((value) => value.trim())) {
      Swal.fire({
        title: "Error",
        text: "Por favor complete todos los campos",
        icon: "error",
      });
      return;
    }
    // Enviar datos al componente padre para mostrar resumen
    onFinalizarCompra(usuario);
  };

  return (
    <div className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Completa tus datos para finalizar la compra
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre y Apellido"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            name="localidad"
            placeholder="Localidad"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            name="provincia"
            placeholder="Provincia"
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Revisar Compra
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCompra;
