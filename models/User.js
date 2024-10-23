const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    identificationNumber: { type: String, required: true, unique: true }, // Asegúrate de que este campo sea único
    phone: { type: String, required: true },
    address: { type: String, required: true },
    credits: [{ type: Schema.Types.ObjectId, ref: 'Credit' }] // Referencia a los créditos
});

module.exports = mongoose.model('User', UserSchema);
