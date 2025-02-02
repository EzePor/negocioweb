export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Método no permitido" });
  }

  try {
    const response = await fetch(`http://localhost:2025/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    console.log("Data login:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
}
