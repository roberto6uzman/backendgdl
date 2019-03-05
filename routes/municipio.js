// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models municipio
var Municipio = require('../models/municipio');


// ==========================================
// Rutas Obtener todos los municipios
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Municipio.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('region', 'nombre')
        .exec(
            (err, municipios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando municipios',
                        errors: err
                    });
                }

                Municipio.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        municipios: municipios,
                        total: conteo
                    });
                });


            });


});


// ==========================================
// Rutas Crear una municipio
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var municipio = new Municipio({
        nombre: body.nombre,
        usuario: req.usuario._id,
        region: body.region
    });

    municipio.save((err, municipioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear municipio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            municipio: municipioGuardado
        });

    });
});


// ==========================================
// Rutas actualizar municipio
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Municipio.findById(id, (err, municipio) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar municipio',
                errors: err
            });
        }

        if (!municipio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'municipio con el id' + id + 'no existe',
                errors: { message: 'no existe municipio con ese ID' }
            });
        }

        municipio.nombre = body.nombre;
        municipio.usuario = req.usuario._id;
        municipio.region = body.region;

        municipio.save((err, municipioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar municipio',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                municipio: municipioGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un municipio por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Municipio.findByIdAndRemove(id, (err, municipioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar municipio',
                errors: err
            });
        }

        if (!municipioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe municipio con ese ID',
                errors: { message: 'no existe municipio con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            municipio: municipioBorrado
        });

    });
});


module.exports = app;