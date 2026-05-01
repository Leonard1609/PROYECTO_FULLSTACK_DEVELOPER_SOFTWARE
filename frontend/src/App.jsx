import React from 'react';
import Alertas from './components/Alertas';
import FormularioProducto from './components/FormularioProducto';
import ListaProductos from './components/ListaProductos';

function App() {
  return (
    <div className="container py-4">
      <header className="text-center mb-5">
        <h1 className="display-4 text-primary">Botica Nova Salud</h1>
        <p className="lead">Sistema Automatizado de Gestión Farmacéutica</p>
      </header>

      <div className="row">
        <div className="col-md-12">
          {/* Módulo de Alertas Automáticas para reposición */}
          <Alertas /> 
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          {/* Registro de nuevos productos para optimizar gestión */}
          <FormularioProducto />
        </div>
        <div className="col-md-8">
          {/* Registro de ventas y atención al cliente ágil */}
          <ListaProductos />
        </div>
      </div>
    </div>
  );
}

export default App;