const express = require('express');
const { usersRouter } = require('./users/users.routes.js');
const { jerseyRouter } = require('./Jerseys/jersey.routes.js');
const { cartRouter } = require('./users/cart/cart.routes.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const { JerseyModel } = require('./Jerseys/jersey.model.js');

// Configuración
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27018/RetroscoreDB';

const startServer = async () => {
    try {
        // Conexión a MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a la base de datos MongoDB');

        const app = express();

        // Middlewares
        app.use(cors());
        app.use(bodyParser.json());
        app.use(morgan('dev'));

        // Registro de solicitudes (para debugging)
        app.use((req, res, next) => {
            console.log('Incoming Request:', {
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: req.body,
            });
            next();
        });

        // Rutas
        app.use('/Users', usersRouter);
        app.use('/Jerseys', jerseyRouter);
        app.use('/cart', cartRouter);

        // Inicialización del servidor
        app.listen(PORT, async () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);

            // Verificar si hay datos en la colección de jerseys
            const existingJerseys = await JerseyModel.find();
            if (existingJerseys.length === 0) {
                console.log('No se encontraron jerseys en la base de datos. Insertando datos...');
                try {
                    const jerseyList = JSON.parse(fs.readFileSync('jerseys.json', 'utf8'));
                    await JerseyModel.insertMany(jerseyList);
                    console.log('Jerseys insertados exitosamente.');
                } catch (error) {
                    console.error('Error al insertar jerseys:', error);
                }
            } else {
                console.log('Jerseys ya existentes en la base de datos.');
            }
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Salir del proceso si hay un error crítico
    }
};

startServer();
