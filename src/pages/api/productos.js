import { formidable } from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Asegurar que el directorio existe
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const { method } = req;
  const { id } = req.query;
  console.log("ID recibido en la API:", id);

  /*if (method === "GET") {
    try {
      const response = await fetch("http://localhost:2025/productos");
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "No se pudo obtener los productos" });
    }
  }*/

  if (method === "GET") {
    try {
      // Si hay un ID, obtener producto específico
      if (id) {
        console.log("Obteniendo producto específico. ID:", id);

        const response = await fetch(`http://localhost:2025/productos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const producto = await response.json();
        console.log("Producto encontrado:", producto);
        return res.status(200).json(producto);
      }

      // Si no hay ID, obtener todos los productos
      const response = await fetch("http://localhost:2025/productos");
      const productos = await response.json();
      console.log("Total productos obtenidos:", productos.length);
      return res.status(200).json(productos);
    } catch (error) {
      console.error("Error detallado:", error);
      return res.status(500).json({
        error: id
          ? "Error al obtener el producto"
          : "Error al obtener los productos",
        details: error.message,
      });
    }
  }
  if (method === "POST") {
    try {
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

      const formDataToSend = new FormData();

      // Agregar campos de texto
      formDataToSend.append("nombre", fields.nombre[0]);
      formDataToSend.append("descripcion", fields.descripcion[0]);
      formDataToSend.append("categoria", fields.categoria[0]);
      formDataToSend.append("precio", fields.precio[0]);
      formDataToSend.append("descuento", fields.descuento[0]);
      formDataToSend.append("precioDescuento", fields.precioDescuento[0]);

      // Convertir archivo a Blob
      if (files.imagen && files.imagen[0]) {
        const file = files.imagen[0];
        const buffer = fs.readFileSync(file.filepath);
        const blob = new Blob([buffer], { type: file.mimetype });
        formDataToSend.append("imagen", blob, file.originalFilename);
      }

      const response = await fetch("http://localhost:2025/productos", {
        method: "POST",
        body: formDataToSend,
      });

      const resultado = await response.json();

      // Limpiar archivo temporal
      if (files.imagen && files.imagen[0]) {
        fs.unlinkSync(files.imagen[0].filepath);
      }

      res.status(201).json(resultado);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  if (method === "PUT") {
    try {
      // Verificar ID
      if (!id) {
        return res.status(400).json({ error: "ID no proporcionado" });
      }

      console.log("ID recibido en PUT:", id);

      const form = formidable({
        uploadDir: path.join(process.cwd(), "public", "uploads"),
        keepExtensions: true,
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      console.log("Campos recibidos:", fields);
      console.log("Archivos recibidos:", files);

      const formDataToSend = new FormData();

      // Agregar ID explícitamente
      formDataToSend.append("id", id);

      // Agregar campos de texto
      Object.keys(fields).forEach((key) => {
        formDataToSend.append(key, fields[key][0]);
      });

      // Manejar imagen si se subió una nueva
      if (files.imagen && files.imagen[0]) {
        const file = files.imagen[0];
        const buffer = fs.readFileSync(file.filepath);
        const blob = new Blob([buffer], { type: file.mimetype });
        formDataToSend.append("imagen", blob, file.originalFilename);
      }

      const response = await fetch(`http://localhost:2025/productos/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Error del servidor: ${response.status} - ${errorData}`
        );
      }

      const resultado = await response.json();
      console.log("Respuesta del backend:", resultado);

      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error detallado:", error);
      res.status(500).json({
        error: error.message,
        details: "Error al actualizar el producto",
      });
    }
  }

  if (method === "DELETE") {
    try {
      const { id } = req.query;
      const data = JSON.parse(req.body);
      console.log("Datos del producto recibidos: ", data);

      const response = await fetch(`http://localhost:2025/productos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resultado = await response.json();
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
  }
}
