// instalar npm install --save express-fileupload

// Requires
var express = require('express');

//fileupload
const fileUpload = require('express-fileupload');
var fs = require('fs');

// inicializar variables
var app = express();

var Usuario = require('../models/usuario');
var Perfpolicia = require('../models/perfilpolicia');

// default options
app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['huellasder', 'huellasizq', 'perfiles', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'coleccion no valida',
            error: { message: 'coleccion no valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            error: { message: 'debe seleccionar una imagen' }
        });
    }

    //obtener nombre del archivo

    var archivo = req.files.img;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo aceptamos estas extensiones
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            error: { message: 'las extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    //nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover archivo
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                error: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);


    })




});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {


        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al encontrar usuario',
                    error: { message: 'usuario no existe' }
                });
            } else {
                var pathViejo = './uploads/usuarios/' + usuario.img;

                //Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save((err, usuarioActualizado) => {

                    usuarioActualizado.password = 'PASSWORD_ENCRYPT';

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar actualizacion',
                            error: err
                        });
                    } else {

                        return res.status(200).json({
                            ok: true,
                            mensaje: 'imagen actualizada correctamente',
                            usuario: usuarioActualizado
                        });

                    }

                })

            }

        });


    }

    if (tipo === 'perfiles') {


        Perfpolicia.findById(id, (err, perfil) => {

            if (!perfil) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al encontrar perfil',
                    error: { message: 'perfil no existe' }
                });
            } else {
                var pathViejo = './uploads/perfiles/' + perfil.img;

                //Si existe elimina la imagen anterior
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                perfil.img = nombreArchivo;

                perfil.save((err, perfilActualizado) => {


                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar actualizacion',
                            error: err
                        });
                    } else {

                        return res.status(200).json({
                            ok: true,
                            mensaje: 'imagen actualizada correctamente',
                            perfil: perfilActualizado
                        });

                    }

                })

            }

        });




    }




}




module.exports = app;