import React, { useState } from 'react';
import './ListaProductos.css';

function ListaProductos({ productos, onActualizar, isGestionView }) {
    const [editandoId, setEditandoId] = useState(null);
    const [editForm, setEditForm] = useState({ nombre: '', stock_actual: 0, precio: 0 });

    // --- FUNCIONES DE ACCIÓN ---
    const realizarVenta = (id, stockActual, precio, nombre) => {
        if (stockActual <= 0) return alert(`No hay stock de ${nombre}`);
        fetch('http://localhost:5000/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_producto: id, cantidad: 1, total: precio })
        }).then(() => onActualizar());
    };

    const eliminarProducto = (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro?")) {
            fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' })
                .then(() => onActualizar());
        }
    };

    const iniciarEdicion = (p) => {
        setEditandoId(p.id);
        setEditForm({ nombre: p.nombre, stock_actual: p.stock_actual, precio: p.precio });
    };

    const guardarEdicion = (id) => {
        fetch(`http://localhost:5000/api/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        }).then(() => {
            setEditandoId(null);
            onActualizar();
        });
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);
    };

    return (
        <div className="table-responsive">
            <table className="nova-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        {isGestionView && <th>Fecha Ingreso</th>}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id}>
                            {editandoId === p.id ? (
                                <>
                                    {/* MODO EDICIÓN */}
                                    <td><input type="text" value={editForm.nombre} onChange={e => setEditForm({...editForm, nombre: e.target.value})} /></td>
                                    <td><input type="number" value={editForm.stock_actual} onChange={e => setEditForm({...editForm, stock_actual: e.target.value})} /></td>
                                    <td><input type="number" value={editForm.precio} onChange={e => setEditForm({...editForm, precio: e.target.value})} /></td>
                                    {isGestionView && <td>-</td>}
                                    <td>
                                        <button className="btn-save-mini" onClick={() => guardarEdicion(p.id)}>💾</button>
                                        <button className="btn-cancel-mini" onClick={() => setEditandoId(null)}>❌</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    {/* MODO LECTURA */}
                                    <td>{p.nombre}</td>
                                    <td className={p.stock_actual <= 5 ? "stock-critical" : ""}>
                                        {Number(p.stock_actual).toFixed(2)}
                                    </td>
                                    <td>{formatCurrency(p.precio)}</td>
                                    {isGestionView && <td>{new Date(p.fecha_creacion || Date.now()).toLocaleDateString()}</td>}
<td>
    {isGestionView ? (
        <div className="btn-group-admin">
            <button className="btn-edit" onClick={() => iniciarEdicion(p)} title="Editar">
                ✎
            </button>
            <button className="btn-delete" onClick={() => eliminarProducto(p.id)} title="Eliminar">
                🗑
            </button>
        </div>
    ) : (
        <button 
            className="btn-sell" 
            onClick={() => realizarVenta(p.id, p.stock_actual, p.precio, p.nombre)}
            disabled={p.stock_actual <= 0}
        >
            {p.stock_actual <= 0 ? "Agotado" : "Vender (-1)"}
        </button>
    )}
</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ListaProductos;