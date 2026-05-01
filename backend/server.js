const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nova_salud'
});

// Endpoint para obtener productos con stock bajo (Alertas)
app.get('/api/alertas', (req, res) => {
    const sql = "SELECT * FROM productos WHERE stock_actual <= stock_minimo";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Endpoint para registrar una venta y descontar stock automáticamente
app.post('/api/ventas', (req, res) => {
    const { id_producto, cantidad, total } = req.body;
    
    // Inicia transacción para asegurar que si falla el descuento, no se registre la venta
    db.beginTransaction((err) => {
        const sqlVenta = "INSERT INTO ventas (total) VALUES (?)";
        db.query(sqlVenta, [total], (err, result) => {
            const idVenta = result.insertId;
            const sqlUpdateStock = "UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?";
            
            db.query(sqlUpdateStock, [cantidad, id_producto], (err) => {
                db.commit(() => {
                    res.json({ message: "Venta registrada y stock actualizado" });
                });
            });
        });
    });
});

// Obtener todos los productos para la tabla principal
app.get('/api/productos', (req, res) => {
    const sql = "SELECT * FROM productos";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar nuevo producto (Create del CRUD)
app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock_actual, stock_minimo } = req.body;
    const sql = "INSERT INTO productos (nombre, precio, stock_actual, stock_minimo) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre, precio, stock_actual, stock_minimo], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto agregado con éxito", id: result.insertId });
    });
});

app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));