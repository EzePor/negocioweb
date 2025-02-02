"use client";
import { useState } from "react";
import { loginUser } from "../../server/actions/auth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("usuario", JSON.stringify(res.usuario));
      console.log("Usuario almacenado:", localStorage.getItem("usuario"));
      console.log("Token almacenado:", localStorage.getItem("token"));
      setSuccess("Login exitoso, redirigiendo...");
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-4">Iniciar sesión</h2>

        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google"
            className="w-5 h-5"
          />
          Iniciar sesión con Google
        </button>

        <div className="flex items-center justify-between my-4">
          <span className="w-full border-t border-gray-700"></span>
          <span className="px-2 text-gray-500">o</span>
          <span className="w-full border-t border-gray-700"></span>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded text-blue-500 focus:ring-0 bg-gray-700 border-gray-600"
              />
              <label htmlFor="remember" className="text-sm text-gray-300">
                Recordar contraseña
              </label>
            </div>
            <a href="#" className="text-sm text-blue-400 hover:underline">
              Olvidé mi contraseña
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white py-2 rounded-lg transition"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            ¿No tienes una cuenta?{" "}
            <a href="/registrarse" className="text-pink-400 hover:underline">
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
