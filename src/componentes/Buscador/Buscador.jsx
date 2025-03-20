import React from 'react';
// import { useProductos } from '../../context/ProductosContext'; // Usar el contexto

function Buscador() {
//   const { filtro, setFiltro } = useProductos();  // Acceder al filtro global

//   const manejarCambio = (e) => {
//     setFiltro(e.target.value);  // Actualizar el filtro
//   };

  return (
    <div className="contenedor-buscador">
      <input
        type="text"
        // value={filtro}  // Mostrar el valor actual del filtro
        // onChange={manejarCambio}  // Actualizar el filtro al escribir
        placeholder="Buscar..."
        className="input-buscador"
      />
    </div>
  );
}

export default Buscador;
