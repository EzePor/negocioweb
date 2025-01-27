import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  //const { id } = req.query;
  const {
    method,
    query: { id },
  } = req;
  console.log("ID recibido en la API:", id);

  if (!id) {
    return res.status(400).json({ error: "ID no proporcionado" });
  }

  if (req.method === "GET") {
    try {
      // Verificar la ruta correcta al backend
      const response = await fetch(`http://localhost:2025/productos/${id}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return res.status(response.status).json({
          error: "Error al obtener el producto",
          details: errorText,
        });
      }

      const producto = await response.json();
      console.log("Producto obtenido:", producto);
      return res.status(200).json(producto);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return res.status(500).json({
        error: "Error del servidor",
        details: error.message,
      });
    }
  }

  //return res.status(405).json({ error: "Método no permitido" });

  if (method === "PUT") {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024,
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      // Validar campos
      if (!fields.precio || isNaN(Number(fields.precio))) {
        throw new Error("Precio inválido o no proporcionado");
      }

      // Crear FormData para enviar al backend
      const formDataToSend = new FormData();
      Object.keys(fields).forEach((key) => {
        formDataToSend.append(key, fields[key]);
      });

      // Agregar archivo de imagen, si existe
      if (files.imagen) {
        const file = files.imagen[0];
        const buffer = fs.readFileSync(file.filepath);
        const blob = new Blob([buffer], { type: file.mimetype });
        formDataToSend.append("imagen", blob, file.originalFilename);
      }

      console.log("Datos a enviar al backend:", {
        id,
        fields,
        files,
        formDataToSend,
      });

      const response = await fetch(`http://localhost:2025/productos/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Error del backend: ${response.status}`);
      }

      const resultado = await response.json();
      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
