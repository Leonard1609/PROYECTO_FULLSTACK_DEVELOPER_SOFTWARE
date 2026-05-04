import React, { useState, useEffect } from 'react';
import FormularioProducto from './components/FormularioProducto';
import ListaProductos from './components/ListaProductos';
import Alertas from './components/Alertas';
import './App.css';

function App() {
    const [productos, setProductos] = useState([]);
    const [view, setView] = useState('login'); 
    const [darkMode, setDarkMode] = useState(true);

    const cargarDatos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error cargando productos:", err));
    };

    useEffect(() => { 
        cargarDatos(); 
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    const productosAgrupados = productos.reduce((acc, item) => {
        const existe = acc.find(p => p.nombre.toLowerCase() === item.nombre.toLowerCase());
        if (existe) {
            existe.stock_actual = Number(existe.stock_actual) + Number(item.stock_actual);
            return acc;
        }
        return [...acc, { ...item }];
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const themeClass = darkMode ? 'dark' : 'light';

    if (view === 'login') {
        return (
            <div className={`login-page ${themeClass}`}>
                <div className="login-card">
                    <h1 className="tech-title">NOVA SALUD 💊</h1>
                    <p className="sub-text">Seleccione área de acceso</p>
                    <div className="login-actions">
                        <button className="btn-tech" onClick={() => setView('ventas')}>Área de Ventas</button>
                        <button className="btn-tech" onClick={() => setView('gestion')}>Gestión Administrativa</button>
                    </div>
                    <button onClick={toggleDarkMode} className="btn-mode">
  <span className="mode-text">
    {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
  </span>
</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`dashboard-wrapper ${themeClass}`}>
            <nav className="top-nav">
                <span className="brand">Nova Salud - {view === 'ventas' ? 'Punto de Venta' : 'Administración'}</span>
                <div className="nav-actions">
                    <button className="btn-mode-nav" onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
                    <button onClick={() => setView('login')} className="btn-logout">Cerrar Sesión</button>
                </div>
            </nav>

            <header className="main-header" style={{ padding: '1rem 2rem' }}>
                <h1 className="tech-title">{view === 'ventas' ? 'Atención al Cliente' : 'Panel de Inventario'}</h1>
                <button className="btn-tech" style={{ width: 'auto' }} onClick={() => setView(view === 'ventas' ? 'gestion' : 'ventas')}>
                    {view === 'ventas' ? '← Ir a Gestión' : 'Ir a Ventas →'}
                </button>
            </header>
            
            <main className="content">
                <Alertas productos={productos} />
                <div className={view === 'gestion' ? "grid-system" : "single-column"}>
                    {view === 'gestion' && (
                        <section className="side-panel">
                            <div className="card">
                                <h3>Registrar Nuevo Lote</h3>
                                <FormularioProducto onProductoGuardado={cargarDatos} />
                            </div>
                        </section>
                    )}
                    <section className="main-panel">
                        <div className="card">
                            <h3>{view === 'ventas' ? 'Productos Disponibles' : 'Registro Histórico (CRUD)'}</h3>
                            <ListaProductos 
                                isGestionView={view === 'gestion'} 
                                productos={view === 'ventas' ? productosAgrupados : productos} 
                                onActualizar={cargarDatos} 
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;