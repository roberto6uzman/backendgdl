// Requires
var express = require('express');
var mongoose = require('mongoose');
// npm install body-parser --save
var bodyParser = require('body-parser');


// inicializar variables
var app = express();

// Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


// Importar rutas
var imagenesRoutes = require('./routes/imagenes');
var uploadRoutes = require('./routes/upload');
var appRoutes = require('./routes/app');
var busquedaRoutes = require('./routes/busqueda');
var perfilpoliciaRoutes = require('./routes/perfpolicia');
var escolaridadpoliciaRoutes = require('./routes/escpolicia');
var categoriapoliciaRoutes = require('./routes/catpolicia');
var coloniaRoutes = require('./routes/colonia');
var municipioRoutes = require('./routes/municipio');
var regionRoutes = require('./routes/region');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');



// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/admingdlDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

})


// Rutas
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/perfpolicia', perfilpoliciaRoutes);
app.use('/escpolicia', escolaridadpoliciaRoutes);
app.use('/catpolicia', categoriapoliciaRoutes);
app.use('/colonia', coloniaRoutes);
app.use('/municipio', municipioRoutes);
app.use('/region', regionRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/', appRoutes);


// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});