// Requires
var express = require('express');
//token autenticacion.js
mdAutenticacion = require('../middleware/autenticacion');


// inicializar variables
var app = express();

//models municipio
var Perfpolicia = require('../models/perfilpolicia');


// ==========================================
// Rutas Obtener todos los perfiles
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Perfpolicia.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .populate('adregion', 'nombre')
        .populate('admunicipio', 'nombre')
        .populate('escolaridad', 'nombre')
        .populate('colonia', 'nombre')
        .populate('municipio', 'nombre')
        .exec(
            (err, perfiles) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando perfiles',
                        errors: err
                    });
                }

                Perfpolicia.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        perfiles: perfiles,
                        total: conteo
                    });

                });

            });


});


// ==========================================
// Rutas Crear una perfil
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var perfil = new Perfpolicia({
        nombre: body.nombre,
        apaterno: body.apaterno,
        amaterno: body.amaterno,
        categoria: body.categoria,
        adregion: body.adregion,
        admunicipio: body.admunicipio,
        fingreso: body.fingreso,
        noexpediente: body.noexpediente,
        alaboral: body.alaboral,
        fnacimiento: body.fnacimiento,
        edad: body.edad,
        rfc: body.rfc,
        cuip: body.cuip,
        curp: body.curp,
        escolaridad: body.escolaridad,
        calle: body.calle,
        colonia: body.colonia,
        cp: body.cp,
        municipio: body.municipio,
        tel: body.tel,
        cel: body.cel,
        forpolicial: body.forpolicial,
        observaciones: body.observaciones,
        usuario: req.usuario._id
    });

    perfil.save((err, perfilGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear perfil',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            perfil: perfilGuardado
        });

    });
});


// ==========================================
// Rutas actualizar perfil
// ==========================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Perfpolicia.findById(id, (err, perfil) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar perfil',
                errors: err
            });
        }

        if (!perfil) {
            return res.status(400).json({
                ok: false,
                mensaje: 'perfil con el id' + id + 'no existe',
                errors: { message: 'no existe perfil con ese ID' }
            });
        }

        perfil.nombre = body.nombre;
        perfil.apaterno = body.apaterno;
        perfil.amaterno = body.amaterno;
        perfil.categoria = body.categoria;
        perfil.adregion = body.adregion;
        perfil.admunicipio = body.admunicipio;
        perfil.fingreso = body.fingreso;
        perfil.noexpediente = body.noexpediente;
        perfil.alaboral = body.alaboral;
        perfil.fnacimiento = body.fnacimiento;
        perfil.edad = body.edad;
        perfil.rfc = body.rfc;
        perfil.cuip = body.cuip;
        perfil.curp = body.curp;
        perfil.escolaridad = body.escolaridad;
        perfil.calle = body.calle;
        perfil.colonia = body.colonia;
        perfil.cp = body.cp;
        perfil.municipio = body.municipio;
        perfil.tel = body.tel;
        perfil.cel = body.cel;
        perfil.forpolicial = body.forpolicial;
        perfil.observaciones = body.observaciones;
        perfil.usuario = req.usuario._id;

        perfil.save((err, perfilGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar perfil',
                    errors: err

                });
            }
            res.status(200).json({
                ok: true,
                perfil: perfilGuardado
            });

        });
    });


});


// ==========================================
// Rutas Borrar un perfil por el id
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Perfpolicia.findByIdAndRemove(id, (err, perfilBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar perfil',
                errors: err
            });
        }

        if (!perfilBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'no existe perfil con ese ID',
                errors: { message: 'no existe perfil con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            perfil: perfilBorrado
        });

    });
});


module.exports = app;