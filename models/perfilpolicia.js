var mongoose = require('mongoose');
// npm install mongoose-unique-validator --save
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var perfilpoliciaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apaterno: { type: String, required: [true, 'El apellido paterno es necesario'] },
    amaterno: { type: String, required: [true, 'El apellido materno es necesario'] },
    categoria: { type: Schema.Types.ObjectId, ref: 'Catpolicia', required: true },
    adregion: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
    admunicipio: { type: Schema.Types.ObjectId, ref: 'Municipio', required: true },
    fingreso: { type: Date, required: [true, 'La fecha de ingreso es necesario'] },
    noexpediente: { type: String, required: [true, 'El numero de expediente es necesario'] },
    alaboral: { type: Number, required: [true, 'La antiguedad laboral es necesario'] },
    fnacimiento: { type: Date, required: [true, 'La fecha de nacimiento es necesario'] },
    edad: { type: Number, required: [true, 'La edad es necesario'] },
    rfc: { type: String, required: false },
    cuip: { type: String, required: false },
    curp: { type: String, unique: true, required: [true, 'La CURP es necesaria'] },
    escolaridad: { type: Schema.Types.ObjectId, ref: 'Escpolicia', required: true },
    calle: { type: String, required: [true, 'La calle es necesaria'] },
    colonia: { type: Schema.Types.ObjectId, ref: 'Colonia', required: true },
    cp: { type: Number, required: [true, 'El Codigo postal es necesario'] },
    municipio: { type: Schema.Types.ObjectId, ref: 'Municipio', required: true },
    tel: { type: String, required: false },
    cel: { type: String, required: false },
    forpolicial: { type: String, required: false },
    observaciones: { type: String, required: false },
    img: { type: String, required: false },
    huellaizq: { type: String, required: false },
    huellader: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

}, { collection: 'perfilpolicia' });


perfilpoliciaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model('Perfpolicia', perfilpoliciaSchema);