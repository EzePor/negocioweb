import ProductoFormModificar from "@/app/componentes/ProductoFormModificar";
import { ProductosFormActionHandler } from "@/server/actions/productos";

export default function ModificarProductoPage({ params }) {
  const { id } = params;
  console.log("ModificarProductoPage -id:{id}", id);

  if (!id) {
    return <div>Error: ID no proporcionado</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Modificar Producto</h1>
      <ProductoFormModificar id={id} handler={ProductosFormActionHandler} />
    </div>
  );
}
