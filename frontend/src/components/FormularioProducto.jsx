import React, { useState } from 'react';
import './FormularioProducto.css';

function FormularioProducto({ onProductoGuardado }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');

    const guardar = (e) => {
        e.preventDefault();
        if (precio <= 0 || stock < 0) return alert("Valores no válidos.");

        fetch('http://localhost:5000/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, precio, stock_actual: stock, stock_minimo: 5 })
        })
        .then(res => res.json())
        .then(() => {
            alert("✅ Producto guardado correctamente");
            onProductoGuardado(); // Actualiza App.js inmediatamente
            setNombre(''); setPrecio(''); setStock('');
        });
    };

    return (
        <form className="nova-form" onSubmit={guardar}>
            <input type="text" placeholder="Nombre" value={nombre} required
                   onChange={e => setNombre(e.target.value)} />
            
            <input type="number" step="0.01" placeholder="Precio (S/)" value={precio} required
                   onChange={e => setPrecio(e.target.value)} />
            
            {/* step="0.01" permite decimales en el stock */}
            <input type="number" step="0.01" placeholder="Stock Inicial" value={stock} required
                   onChange={e => setStock(e.target.value)} />
            
            <button type="submit" className="btn-save">Guardar Inventario</button>
        </form>
    );
}
export default FormularioProducto;