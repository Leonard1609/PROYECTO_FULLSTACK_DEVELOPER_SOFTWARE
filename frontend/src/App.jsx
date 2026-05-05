import React, { useState, useEffect } from 'react';
import FormularioProducto from './components/FormularioProducto';
import ListaProductos from './components/ListaProductos';
import Alertas from './components/Alertas';
import './App.css';

function App() {
    const [productos, setProductos] = useState([]);
    const [view, setView] = useState('login'); 
    const [darkMode, setDarkMode] = useState(true);
    
    // NUEVOS ESTADOS PARA SEGURIDAD
    const [user, setUser] = useState(null); // Almacena el usuario logueado
    const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });

    const cargarDatos = () => {
        fetch('http://localhost:5000/api/productos')
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error cargando productos:", err));
    };

    useEffect(() => { cargarDatos(); }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);

    // LÓGICA DE LOGIN
    const manejarLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                // Si es admin va a gestión, si es vendedor va a ventas
                setView(data.user.rol === 'administrador' ? 'gestion' : 'ventas');
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    };

    const logout = () => {
        setUser(null);
        setView('login');
        setCredenciales({ usuario: '', password: '' });
    };

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

    // PANTALLA DE LOGIN (CON SEGURIDAD)
    if (view === 'login') {
        return (
            <div className={`login-page ${themeClass}`}>
                <form className="login-card" onSubmit={manejarLogin}>
                    <h1 className="tech-title">NOVA SALUD 💊</h1>
                    <p className="sub-text">Control de Acceso de Seguridad</p>
                    
                    <div className="login-inputs" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            className="input-login"
                            type="text" 
                            placeholder="Usuario" 
                            value={credenciales.usuario}
                            onChange={(e) => setCredenciales({...credenciales, usuario: e.target.value})}
                            required 
                        />
                        <input 
                            className="input-login"
                            type="password" 
                            placeholder="Contraseña" 
                            value={credenciales.password}
                            onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-tech">Ingresar al Sistema</button>
                    
                    <button type="button" onClick={toggleDarkMode} className="btn-mode" style={{marginTop: '20px'}}>
                        {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                    </button>
                </form>
            </div>
        );
    }

    // DASHBOARD (VENTAS O GESTIÓN)
    return (
        <div className={`dashboard-wrapper ${themeClass}`}>
            <nav className="top-nav">
                <span className="brand">
                    Nova Salud - {view === 'ventas' ? 'Punto de Venta' : 'Administración'} 
                    <small style={{marginLeft: '10px', opacity: 0.7}}>(Sesión: {user?.usuario})</small>
                </span>
                <div className="nav-actions">
                    <button className="btn-mode-nav" onClick={toggleDarkMode}>{darkMode ? '☀️' : '🌙'}</button>
                    <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
                </div>
            </nav>

            <header className="main-header" style={{ padding: '1rem 2rem' }}>
                <h1 className="tech-title">{view === 'ventas' ? 'Atención al Cliente' : 'Panel de Inventario'}</h1>
                
                {/* 🛡️ SEGURIDAD: Solo el admin puede ver el botón para cambiar entre vistas */}
                {user?.rol === 'administrador' && (
                    <button className="btn-tech" style={{ width: 'auto' }} onClick={() => setView(view === 'ventas' ? 'gestion' : 'ventas')}>
                        {view === 'ventas' ? '← Ir a Gestión' : 'Ir a Ventas →'}
                    </button>
                )}
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