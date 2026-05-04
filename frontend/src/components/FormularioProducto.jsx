import React, { useState } from 'react';
import './FormularioProducto.css';

function FormularioProducto({ onProductoGuardado }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');

    const guardar = (e) => {
        e.preventDefault();

        const nombreLimpio = nombre.trim();
        if (nombreLimpio.length < 3) return alert("El nombre es muy corto.");
        if (precio <= 0) return alert("El precio debe ser mayor a 0.");
        if (stock < 0) return alert("El stock no puede ser negativo.");

        fetch('http://localhost:5000/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre: nombreLimpio, 
                precio: parseFloat(precio), 
                stock_actual: parseInt(stock), /* Usamos parseInt para stock */
                stock_minimo: 5 
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Error en el servidor");
            return res.json();
        })
        .then(() => {
            onProductoGuardado(); 
            setNombre(''); setPrecio(''); setStock('');
        })
        .catch(err => alert("Error al guardar: " + err.message));
    };

    return (
        <form className="nova-form" onSubmit={guardar}>
            <h3 className="tech-title" style={{fontSize: '1.2rem', marginBottom: '10px'}}>Nuevo Ingreso</h3>
            
            <div className="input-group">
                <input type="text" placeholder="Nombre del medicamento" value={nombre} required
                       onChange={e => setNombre(e.target.value)} />
            </div>
            
            <div className="input-group">
                <span className="currency-prefix">S/</span>
                <input type="number" step="0.10" placeholder="Precio" value={precio} required
                       style={{paddingLeft: '35px'}}
                       onChange={e => setPrecio(e.target.value)} />
            </div>
            
            <div className="input-group">
                <input type="number" step="1" placeholder="Stock Inicial" value={stock} required
                       onChange={e => setStock(e.target.value)} />
            </div>
            
            <button type="submit" className="btn-save">Registrar en Inventario</button>
        </form>
    );
}

export default FormularioProducto;