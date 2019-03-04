// crear token npm install jsonwebtoken
var jwt = require('jsonwebtoken');

//semilla config.js
var SEED = require('../config/config').SEED;


// ==========================================
// verificar token (middleware) saber que usuario hace cambios
// ==========================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });

}