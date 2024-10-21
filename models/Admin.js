const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de Admin
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'Datos' });

// Método para encriptar la contraseña antes de guardar
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Método para comparar la contraseña
AdminSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
