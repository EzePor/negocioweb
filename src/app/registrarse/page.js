"use client";
import { useState } from "react";
import { registerUser } from "../../server/actions/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await registerUser(form);
      setSuccess(res.msg);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:opacity-90"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}
