import { ProductosFormActionHandler } from "@/server/actions/productos";
import ProductoFormAgregar from "./ProductoFormAgregar";

export default function AgregarProducto() {
  return (
    <div className="container mt-14 m-auto w-[80%] ">
      <h1 className="text-center font-extrabold text-4xl">Agregar Producto</h1>
      <ProductoFormAgregar handler={ProductosFormActionHandler} />
    </div>
  );
}
