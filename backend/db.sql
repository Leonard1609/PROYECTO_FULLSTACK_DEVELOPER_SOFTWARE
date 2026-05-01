-- 1. Crear la base de datos (Esto corrige el error Unknown database)
CREATE DATABASE IF NOT EXISTS nova_salud;
USE nova_salud;

-- 2. Crear tabla de productos (Gestión de Inventario)
-- Incluye 'stock_minimo' para las alertas automáticas de reposición
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock_actual INT NOT NULL,
    stock_minimo INT DEFAULT 5,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla de ventas (Registro de Ventas)
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL
);

-- 4. Insertar datos de prueba para verificar la conexión con React
-- Esto te permitirá ver productos de inmediato al cargar la web
INSERT INTO productos (nombre, precio, stock_actual, stock_minimo) VALUES 
('Paracetamol 500mg', 1.50, 50, 10),
('Amoxicilina 250mg', 12.00, 8, 10), -- Este disparará una alerta por bajo stock
('Alcohol en Gel 1L', 15.50, 20, 5);

ALTER TABLE productos MODIFY COLUMN stock_actual DECIMAL(10,2) NOT NULL;
ALTER TABLE productos MODIFY COLUMN stock_minimo DECIMAL(10,2) DEFAULT 5.00;