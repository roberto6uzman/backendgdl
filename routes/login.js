// Requires
var express = require('express');
// encriptar pass npm install bcrypt
var bcrypt = require('bcrypt');
// crear token npm install jsonwebtoken
var jwt = require('jsonwebtoken');

//semilla config.js
var SEED = require('../config/config').SEED;

// inicializar variables
var app = express();



//models usuario
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //crear un token instalar npm install jsonwebtoken
        usuarioDB.password = 'password_encrypt';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });


    });

});







module.exports = app;