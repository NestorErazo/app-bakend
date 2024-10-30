const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Relación con el modelo de usuario
        required: true,
    },
    loanAmount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    installments: {
        type: Number,
        required: true, // Asegura que el campo de cuotas sea obligatorio
    },
    dateIssued: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Credit', CreditSchema);
