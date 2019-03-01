// Requires
var express = require('express');
var mongoose = require('mongoose');


// inicializar variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/admingdlDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})


// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});


// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});