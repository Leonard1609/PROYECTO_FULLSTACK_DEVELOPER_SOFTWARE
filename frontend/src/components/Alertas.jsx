import React from 'react';
import './Alertas.css';

function Alertas({ productos }) {
    // Clasificamos por niveles de urgencia
    const criticos = productos.filter(p => p.stock_actual <= 2);
    const bajos = productos.filter(p => p.stock_actual > 2 && p.stock_actual <= 5);

    // Si no hay nada bajo, no mostramos nada para limpiar la interfaz
    if (criticos.length === 0 && bajos.length === 0) return null;

    return (
        <div className="alerts-container">
            <h4 className="alerts-title">Notificaciones de Inventario</h4>
            
            {/* Alertas Críticas (Stock casi nulo) */}
            {criticos.map(prod => (
                <div key={prod.id} className="alert alert-critical animate-pulse">
                    <span className="icon">🚨</span>
                    <div className="alert-content">
                        <strong>URGENTE:</strong> {prod.nombre} está por agotarse.
                        <small>Stock actual: {Number(prod.stock_actual).toFixed(0)} unidades.</small>
                    </div>
                </div>
            ))}

            {/* Alertas de Advertencia (Stock bajo) */}
            {bajos.map(prod => (
                <div key={prod.id} className="alert alert-warning">
                    <span className="icon">⚠️</span>
                    <div className="alert-content">
                        <strong>Reponer:</strong> {prod.nombre} tiene stock bajo.
                        <small>Quedan {Number(prod.stock_actual).toFixed(0)} unidades.</small>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Alertas;