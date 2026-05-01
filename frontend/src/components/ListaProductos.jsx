import React, { useState, useEffect } from 'react';

function ListaProductos() {
    const [productos, setProductos] = useState([]);

    const cargarProductos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data));
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const realizarVenta = (id, stockActual, precio) => {
        if (stockActual <= 0) return alert("Sin stock disponible");

        fetch('http://localhost:5000/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: 1, total: precio })
        })
        .then(() => {
            alert("Venta realizada con éxito");
            cargarProductos(); // Refresca la tabla y las alertas automáticamente
        });
    };

    return (
        <div className="mt-4 shadow p-3 mb-5 bg-white rounded">
            <h3>Inventario de Productos</h3>
            <table className="table table-striped table-hover">
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
                            <td>{p.stock_actual}</td>
                            <td>S/ {p.precio}</td>
                            <td>
                                <button 
                                    className="btn btn-success btn-sm"
                                    onClick={() => realizarVenta(p.id, p.stock_actual, p.precio)}
                                >
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