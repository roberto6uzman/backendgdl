var mongoose = require('mongoose');
// npm install mongoose-unique-validator --save
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var municipioSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    region: { type: Schema.Types.ObjectId, ref: 'Region', required: [true, 'El id region es un campo obligatorio'] }

}, { collection: 'municipios' });


municipioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model('Municipio', municipioSchema);