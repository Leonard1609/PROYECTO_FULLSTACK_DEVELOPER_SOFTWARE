import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí conectarás con tu API de Node.js/Express
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: user, password: pass })
        });
        
        const data = await response.json();
        if (data.success) {
            onLogin(data.user); // Pasamos el objeto usuario con su rol
        } else {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>NOVA SALUD 💊</h2>
                <p>Inicie sesión para continuar</p>
                
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={user} 
                    onChange={(e) => setUser(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)} 
                    required 
                />
                
                <button type="submit" className="btn-access">Ingresar</button>
            </form>
        </div>
    );
}

export default Login;