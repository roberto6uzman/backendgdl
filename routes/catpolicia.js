// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models categoriapolicia
var Catpolicia = require('../models/categoriapolicia');


// ==========================================
// Rutas Obtener todos los categorias
// ==========================================
app.get('/', (req, res, next) => {
    Catpolicia.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categorias',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    categorias: categorias
                });

            });


});


// ==========================================
// Rutas Crear una categoria
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var categoria = new Catpolicia({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardado
        });

    });
});


// ==========================================
// Rutas actualizar categoria
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Catpolicia.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'categoria con el id' + id + 'no existe',
                errors: { message: 'no existe categoria con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                categoria: categoriaGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un municipio por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Catpolicia.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoria',
                errors: err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe categoria con ese ID',
                errors: { message: 'no existe categoria con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrado
        });

    });
});


module.exports = app;