import { useState, useEffect } from "react";

const ListarFotos = ({ usuarioId }) => {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await fetch(`/api/fotos-usuario/${usuarioId}`);
        const data = await response.json();
        setFotos(data);
      } catch (error) {
        console.error("Error al obtener las fotos", error);
      }
    };

    fetchFotos();
  }, [usuarioId]);

  return (
    <div>
      <h2>Mis Fotos</h2>
      <ul>
        {fotos.map((foto) => (
          <li key={foto._id}>
            <img src={foto.url} alt="Foto subida" width={100} />
            <a href={foto.url} download>
              Descargar
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarFotos;
