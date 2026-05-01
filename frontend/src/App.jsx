import React, { useState, useEffect } from 'react';
import FormularioProducto from './components/FormularioProducto';
import ListaProductos from './components/ListaProductos';
import Alertas from './components/Alertas';
import './App.css';

function App() {
    const [productos, setProductos] = useState([]);

    const cargarDatos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data)); 
    };

    useEffect(() => { cargarDatos(); }, []);

    return (
        <div className="dashboard-container">
            <header className="main-header">
                <h1>Nova Salud 💊</h1>
                <p>Gestión Farmacéutica Profesional</p>
            </header>
            
            <main className="content">
                {/* Pasamos los productos actuales a las alertas */}
                <Alertas productos={productos} />
                
                <div className="grid-system">
                    <section className="side-panel">
                        <div className="card">
                            <h3>Registrar Medicamento</h3>
                            <FormularioProducto onProductoGuardado={cargarDatos} />
                        </div>
                    </section>
                    
                    <section className="main-panel">
                        <div className="card">
                            <h3>Inventario en Tiempo Real</h3>
                            {/* Pasamos productos y la función de actualizar */}
                            <ListaProductos productos={productos} onActualizar={cargarDatos} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
export default App;