var mongoose = require('mongoose');
// npm install mongoose-unique-validator --save
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var regionSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la region es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'regiones' });


regionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model('Region', regionSchema);