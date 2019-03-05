// Requires
var express = require('express');


// inicializar variables
var app = express();

var Municipio = require('../models/municipio');
var Region = require('../models/region');
var Colonia = require('../models/colonia');
var Catpolicia = require('../models/categoriapolicia');
var Escpolicia = require('../models/escolaridadpolicia');
var Perfpolicia = require('../models/perfilpolicia');



// ==========================================
// busqueda especifica
// ==========================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    switch (tabla) {

        case 'municipios':

            promesa = buscarMunicipios(busqueda, regex);

            break;

        case 'regiones':

            promesa = buscarRegion(busqueda, regex);

            break;

        case 'colonias':

            promesa = buscarColonia(busqueda, regex);

            break;

        case 'categorias':

            promesa = buscarCatpolicia(busqueda, regex);

            break;


        case 'escolaridades':

            promesa = buscarEscpolicia(busqueda, regex);

            break;

        case 'perfiles':

            promesa = buscarPerfil(busqueda, regex);

            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'esa no es una categoria de busqueda',
                error: { message: 'coleccion no valida' }
            });

    }

    promesa.then(data => {

        res.status(400).json({
            ok: true,
            [tabla]: data
        });

    })


});


// ==========================================
// busqueda general
// ==========================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarMunicipios(busqueda, regex),
            buscarRegion(busqueda, regex),
            buscarColonia(busqueda, regex),
            buscarCatpolicia(busqueda, regex),
            buscarEscpolicia(busqueda, regex),
            buscarPerfil(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                municipios: respuestas[0],
                regiones: respuestas[1],
                colonias: respuestas[2],
                categorias: respuestas[3],
                escolaridades: respuestas[4],
                perfiles: respuestas[5]

            });

        });

});

function buscarMunicipios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Municipio.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, municipios) => {

                if (err) {

                    reject('error al cargar municipios', err);
                } else {
                    resolve(municipios);
                }
            });

    });
}


function buscarRegion(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Region.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, regiones) => {

                if (err) {

                    reject('error al cargar regiones', err);
                } else {
                    resolve(regiones);
                }
            });

    });


}

function buscarColonia(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Colonia.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, colonias) => {

                if (err) {

                    reject('error al cargar colonias', err);
                } else {
                    resolve(colonias);
                }
            });

    });


}

function buscarCatpolicia(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Catpolicia.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, categorias) => {

                if (err) {

                    reject('error al cargar categorias', err);
                } else {
                    resolve(categorias);
                }
            });

    });


}

function buscarEscpolicia(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Escpolicia.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, escolaridades) => {

                if (err) {

                    reject('error al cargar escolaridades', err);
                } else {
                    resolve(escolaridades);
                }
            });

    });


}


function buscarPerfil(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Perfpolicia.find({}, 'nombre curp noexpediente')


        .or([{ 'nombre': regex }, { 'curp': regex }, { 'noexpediente': regex }])
            .populate('usuario', 'nombre email')
            .exec((err, perfiles) => {
                if (err) {
                    reject('Error al cargar perfiles', err);
                } else {
                    resolve(perfiles);
                }
            })


    });


}

module.exports = app;