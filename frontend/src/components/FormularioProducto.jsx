import React, { useState } from 'react';

function FormularioProducto() {
    const [producto, setProducto] = useState({
        nombre: '', precio: '', stock_actual: '', stock_minimo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        })
        .then(res => res.json())
        .then(() => alert("Producto registrado en Nova Salud"));
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
            <h3>Registrar Medicamento</h3>
            <input type="text" placeholder="Nombre" className="form-control mb-2" 
                   onChange={e => setProducto({...producto, nombre: e.target.value})} />
            <input type="number" placeholder="Precio" className="form-control mb-2" 
                   onChange={e => setProducto({...producto, precio: e.target.value})} />
            <input type="number" placeholder="Stock Inicial" className="form-control mb-2" 
                   onChange={e => setProducto({...producto, stock_actual: e.target.value})} />
            <button type="submit" className="btn btn-primary w-100">Guardar en Inventario</button>
        </form>
    );
}

export default FormularioProducto;