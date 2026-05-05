const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Tu contraseña de XAMPP/MySQL
    database: 'nova_salud'
});

db.connect(err => {
    if (err) console.error("Error conectando a la BD:", err);
    else console.log("Conectado a MySQL: Nova Salud Activo 🚀");
});

// ==========================================
// --- NUEVA ÁREA DE AUTENTICACIÓN (LOGIN) ---
// ==========================================
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;
    
    // Buscamos al usuario por nombre y contraseña
    const sql = "SELECT id, usuario, rol FROM usuarios WHERE usuario = ? AND password = ?";
    
    db.query(sql, [usuario, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });
        
        if (results.length > 0) {
            // Si existe, devolvemos success y los datos del usuario (sin la contraseña)
            res.json({ success: true, user: results[0] });
        } else {
            // Si no coincide, indicamos el error
            res.json({ success: false, message: "Credenciales inválidas" });
        }
    });
});

// --- ÁREA DE ALERTAS ---
app.get('/api/alertas', (req, res) => {
    const sql = "SELECT * FROM productos WHERE stock_actual <= stock_minimo";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- ÁREA DE VENTAS (PROCESO ATÓMICO) ---
app.post('/api/ventas', (req, res) => {
    const { id_producto, cantidad, total } = req.body;
    
    db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);

        const sqlVenta = "INSERT INTO ventas (total) VALUES (?)";
        db.query(sqlVenta, [total], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            const sqlUpdateStock = "UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?";
            db.query(sqlUpdateStock, [cantidad, id_producto], (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));

                db.commit((err) => {
                    if (err) return db.rollback(() => res.status(500).json(err));
                    res.json({ message: "Venta registrada con éxito", id_venta: result.insertId });
                });
            });
        });
    });
});

// --- ÁREA DE PRODUCTOS (CRUD) ---

// READ: Obtener todos
app.get('/api/productos', (req, res) => {
    const sql = "SELECT * FROM productos ORDER BY id DESC"; 
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// CREATE: Agregar nuevo producto
app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock_actual, stock_minimo } = req.body;
    const sql = "INSERT INTO productos (nombre, precio, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, precio, stock_actual, stock_minimo], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto registrado", id: result.insertId });
    });
});

// UPDATE: Editar producto
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock_actual, stock_minimo } = req.body;
    const sql = "UPDATE productos SET nombre = ?, precio = ?, stock_actual = ?, stock_minimo = ? WHERE id = ?";
    db.query(sql, [nombre, precio, stock_actual, stock_minimo, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto actualizado correctamente" });
    });
});

// DELETE: Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto eliminado del sistema" });
    });
});

app.listen(5000, () => console.log("Servidor escuchando en: http://localhost:5000"));