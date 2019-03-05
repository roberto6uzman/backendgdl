// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models escolaridadpolicia
var Escpolicia = require('../models/escolaridadpolicia');


// ==========================================
// Rutas Obtener todas las escolaridades
// ==========================================
app.get('/', (req, res, next) => {
    Escpolicia.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, escolaridades) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando escolaridades',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    escolaridades: escolaridades
                });

            });


});


// ==========================================
// Rutas Crear una escolaridad
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var escolaridad = new Escpolicia({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    escolaridad.save((err, escolaridadGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear escolaridad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            escolaridad: escolaridadGuardado
        });

    });
});


// ==========================================
// Rutas actualizar escolaridad
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Escpolicia.findById(id, (err, escolaridad) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar escolaridad',
                errors: err
            });
        }

        if (!escolaridad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'escolaridad con el id' + id + 'no existe',
                errors: { message: 'no existe escolaridad con ese ID' }
            });
        }

        escolaridad.nombre = body.nombre;
        escolaridad.usuario = req.usuario._id;

        escolaridad.save((err, escolaridadGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar escolaridad',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                escolaridad: escolaridadGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un municipio por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Escpolicia.findByIdAndRemove(id, (err, escolaridadBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar escolaridad',
                errors: err
            });
        }

        if (!escolaridadBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe escolaridad con ese ID',
                errors: { message: 'no existe escolaridad con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            escolaridad: escolaridadBorrado
        });

    });
});


module.exports = app;