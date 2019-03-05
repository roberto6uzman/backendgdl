// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models municipio
var Region = require('../models/region');


// ==========================================
// Rutas Obtener todos los regiones
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Region.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, regiones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando regiones',
                        errors: err
                    });
                }

                Region.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        regiones: regiones,
                        total: conteo
                    });
                });


            });


});


// ==========================================
// Rutas Crear una region
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var region = new Region({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    region.save((err, regionGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear region',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            region: regionGuardado
        });

    });
});


// ==========================================
// Rutas actualizar region
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Region.findById(id, (err, region) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar region',
                errors: err
            });
        }

        if (!region) {
            return res.status(400).json({
                ok: false,
                mensaje: 'region con el id' + id + 'no existe',
                errors: { message: 'no existe region con ese ID' }
            });
        }

        region.nombre = body.nombre;
        region.usuario = req.usuario._id;

        region.save((err, regionGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar region',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                region: regionGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un municipio por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Region.findByIdAndRemove(id, (err, regionBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar region',
                errors: err
            });
        }

        if (!regionBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe region con ese ID',
                errors: { message: 'no existe region con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            region: regionBorrado
        });

    });
});


module.exports = app;