const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://parra:dwyTACPgmi6eEVSCyhCFF1R26lEfKZn8@dpg-cq2bqml6l47c73b2rf3g-a.oregon-postgres.render.com/inventory_r03z',
    ssl: {
        rejectUnauthorized: false // Solo si tu servidor PostgreSQL usa SSL y estás en un entorno de desarrollo
    }
});



// Ruta de ejemplo para obtener datos de la base de datos
app.get('/products', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM productstable');
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Error al ejecutar la consulta', err);
        res.status(500).send('Error del servidor');
    }
});


// Ruta para insertar datos en la base de datos
app.post('/addItem', async (req, res) => {
    const { nombre, price, cantidad } = req.body;

    try {
        const client = await pool.connect();
        const query = 'INSERT INTO productstable (nombre, code, quantity) VALUES ($1, $2, $3) RETURNING *';
        const values = [nombre, price, cantidad];
        const result = await client.query(query, values);
        res.json(result.rows[0]); // Devuelve el primer resultado insertado
        client.release();
    } catch (err) {
        console.error('Error al ejecutar la consulta', err);
        res.status(500).send('Error del servidor');
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
