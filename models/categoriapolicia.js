var mongoose = require('mongoose');
// npm install mongoose-unique-validator --save
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;

var catpoliciaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre de la categoria es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'catpolicias' });


catpoliciaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


module.exports = mongoose.model('Catpolicia', catpoliciaSchema);