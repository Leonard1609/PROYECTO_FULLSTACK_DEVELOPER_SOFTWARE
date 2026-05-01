import React, { useState, useEffect } from 'react';

function Alertas() {
    const [productosBajos, setProductosBajos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/alertas')
            .then(res => res.json())
            .then(data => setProductosBajos(data));
    }, []);

    return (
        <div>
            {productosBajos.map(prod => (
                <div key={prod.id} className="alert-danger">
                    ⚠️ Reponer: {prod.nombre} (Quedan: {prod.stock_actual})
                </div>
            ))}
        </div>
    );
}