import React from 'react';
import './Alertas.css';

function Alertas({ productos }) {
    // Filtramos directamente de la lista que viene de App.js
    const productosBajos = productos.filter(p => p.stock_actual <= 5);

    return (
        <div className="alerts-container">
            {productosBajos.map(prod => (
                <div key={prod.id} className="alert alert-danger shadow-sm mb-2">
                    ⚠️ <strong>Reponer:</strong> {prod.nombre} (Quedan: {prod.stock_actual})
                </div>
            ))}
        </div>
    );
}
export default Alertas;