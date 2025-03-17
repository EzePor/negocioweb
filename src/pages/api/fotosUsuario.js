import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
    // Aumentamos los límites
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ mensaje: "Método no permitido" });
  }

  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB por archivo
      maxTotalFileSize: 500 * 1024 * 1024, // 500MB total
      allowEmptyFiles: false,
      multiples: true,
    });

    // Parsear el formulario
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    // Validar que exista files.imagenes
    if (!files || !files.imagenes) {
      return res.status(400).json({
        mensaje: "No se proporcionaron imágenes",
        debug: { files },
      });
    }

    // Validar imágenes - corregido para manejar array
    const imagenes = Array.isArray(files.imagenes)
      ? files.imagenes
      : [files.imagenes].filter(Boolean); // Filtrar valores nulos

    if (imagenes.length === 0) {
      return res.status(400).json({
        mensaje: "No se proporcionaron imágenes válidas",
      });
    }

    const usuarioId = fields.usuarioId?.[0];
    if (!usuarioId) {
      return res
        .status(400)
        .json({ mensaje: "ID de usuario no proporcionado" });
    }

    // Crear FormData para el backend
    const formDataToSend = new FormData();

    // Procesar múltiples imágenes
    for (const imagen of imagenes) {
      const fileContent = await fs.readFile(imagen.filepath);
      formDataToSend.append(
        "imagenes",
        new Blob([fileContent], { type: imagen.mimetype }),
        imagen.originalFilename
      );
      // Limpiar archivo temporal
      await fs.unlink(imagen.filepath).catch(console.error);
    }

    formDataToSend.append("usuarioId", usuarioId);

    const backendResponse = await fetch(
      "http://localhost:2025/fotosUsuario/subir",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      }
    );

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(
        responseData.mensaje || `Error del servidor: ${backendResponse.status}`
      );
    }

    return res.status(200).json({
      success: true,
      mensaje: `${imagenes.length} ${
        imagenes.length === 1 ? "imagen subida" : "imágenes subidas"
      } correctamente`,
      ...responseData,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error al procesar las imágenes",
      error: error.message,
    });
  }
}
