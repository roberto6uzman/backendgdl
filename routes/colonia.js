// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models colonia
var Colonia = require('../models/colonia');


// ==========================================
// Rutas Obtener todos los colonias
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Colonia.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('municipio', 'nombre')
        .exec(
            (err, colonias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando colonias',
                        errors: err
                    });
                }

                Colonia.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        colonias: colonias,
                        total: conteo
                    });
                });


            });


});


// ==========================================
// Rutas Crear una colonia
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var colonia = new Colonia({
        nombre: body.nombre,
        usuario: req.usuario._id,
        municipio: body.municipio
    });

    colonia.save((err, coloniaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear colonia',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            colonia: coloniaGuardado
        });

    });
});


// ==========================================
// Rutas actualizar colonia
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Colonia.findById(id, (err, colonia) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar colonia',
                errors: err
            });
        }

        if (!colonia) {
            return res.status(400).json({
                ok: false,
                mensaje: 'colonia con el id' + id + 'no existe',
                errors: { message: 'no existe colonia con ese ID' }
            });
        }

        colonia.nombre = body.nombre;
        colonia.usuario = req.usuario._id;
        colonia.municipio = body.municipio;

        colonia.save((err, coloniaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar colonia',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                colonia: coloniaGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un colonia por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Colonia.findByIdAndRemove(id, (err, coloniaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar colonia',
                errors: err
            });
        }

        if (!coloniaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe colonia con ese ID',
                errors: { message: 'no existe colonia con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            colonia: coloniaBorrado
        });

    });
});


module.exports = app;