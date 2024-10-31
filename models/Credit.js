const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreditSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
        required: true,
    },
    payments: [
        {
            amount: { type: Number },
            date: { type: Date, default: Date.now },
        },
    ],
    dateIssued: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Credit', CreditSchema);
