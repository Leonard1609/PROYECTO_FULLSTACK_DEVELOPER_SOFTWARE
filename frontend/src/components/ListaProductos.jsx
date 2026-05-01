import React from 'react';
import './ListaProductos.css';

function ListaProductos({ productos, onActualizar }) {
    const realizarVenta = (id, stockActual, precio) => {
        if (stockActual <= 0) return alert("Sin stock");

        fetch('http://localhost:5000/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: 1, total: precio })
        })
        .then(() => {
            onActualizar(); // Refresca App.js
        });
    };

    return (
        <div className="table-responsive">
            <table className="nova-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id}>
                            <td>{p.nombre}</td>
                            <td className={p.stock_actual <= 5 ? "text-danger fw-bold" : ""}>
                                {p.stock_actual}
                            </td>
                            <td>S/ {p.precio}</td>
                            <td>
                                <button className="btn-sell" onClick={() => realizarVenta(p.id, p.stock_actual, p.precio)}>
                                    Vender (-1)
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ListaProductos;