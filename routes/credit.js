const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importar el modelo de usuario
const Credit = require('../models/Credit'); // Importar el modelo de crédito

// Crear un nuevo crédito para un usuario
router.post('/:identificationNumber/add-credit', async (req, res) => {
    const { identificationNumber } = req.params;
    const { loanAmount, interestRate, installments } = req.body;

    // Verificación de campos
    if (typeof loanAmount !== 'number' || typeof interestRate !== 'number' || typeof installments !== 'number') {
        return res.status(400).json({ message: 'Faltan campos requeridos: loanAmount, interestRate, installments' });
    }

    try {
        const user = await User.findOne({ identificationNumber });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newCredit = new Credit({
            user: user._id,
            loanAmount,
            interestRate,
            installments,
        });

        await newCredit.save();

        user.credits.push(newCredit._id);
        await user.save();

        res.status(201).json({ message: 'Crédito añadido exitosamente', credit: newCredit });
    } catch (error) {
        console.error('Error al añadir crédito:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

// Ruta para obtener créditos de un usuario por identificación
router.get('/:identificationNumber/credits', async (req, res) => {
    const { identificationNumber } = req.params;

    try {
        const userCredits = await User.aggregate([
            { $match: { identificationNumber: identificationNumber } },
            {
                $lookup: {
                    from: 'credits',
                    localField: 'credits',
                    foreignField: '_id',
                    as: 'credits'
                }
            },
            {
                $project: {
                    identificationNumber: 1,
                    fullName: 1,
                    "credits._id": 1,  // Incluir el _id de los créditos
                    "credits.loanAmount": 1,
                    "credits.interestRate": 1,
                    "credits.installments": 1,
                    "credits.remainingInstallments": {
                        $map: {
                            input: "$credits",
                            as: "credit",
                            in: { 
                                $subtract: [
                                    "$$credit.installments", 
                                    { $ifNull: [{ $size: { $ifNull: ["$$credit.payments", []] } }, 0] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);

        if (!userCredits || userCredits.length === 0) {
            return res.status(404).json({ message: 'Usuario o créditos no encontrados' });
        }

        res.status(200).json(userCredits[0]);
    } catch (error) {
        console.error('Error al obtener créditos:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});


const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !loanAmount || !interestRate || !installments) {
        alert('Faltan campos requeridos');
        return;
    }

    try {
        const response = await axios.post(`https://app-bakend.onrender.com/api/credit/${selectedUser.identificationNumber}/add-credit`, {
            loanAmount: parseFloat(loanAmount),
            interestRate: parseFloat(interestRate),
            installments: parseInt(installments),
        });
        alert(response.data.message);
        
        // Limpiar campos después de añadir crédito
        setLoanAmount('');
        setInterestRate('');
        setInstallments('');
    } catch (error) {
        console.error('Error adding credit:', error);
        alert('Error al añadir el crédito');
    }
};

// Ruta para abonar a un crédito
router.patch('/:creditId/payment', async (req, res) => {
    const { creditId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'El monto del abono debe ser un número positivo' });
    }

    try {
        const credit = await Credit.findById(creditId);
        if (!credit) {
            return res.status(404).json({ message: 'Crédito no encontrado' });
        }

        // Agregar el pago al array de pagos
        credit.payments.push({ amount, date: new Date() });

        // Actualizar el monto restante
        credit.loanAmount -= amount;

        // Guardar el crédito actualizado
        await credit.save();

        res.status(200).json({
            message: 'Abono realizado con éxito',
            credit
        });
    } catch (error) {
        console.error('Error al realizar el abono:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});


router.get('/:creditId', async (req, res) => {
    const { creditId } = req.params;

    try {
        const credit = await Credit.findById(creditId);
        if (!credit) {
            return res.status(404).json({ message: 'Crédito no encontrado' });
        }

        res.status(200).json(credit);
    } catch (error) {
        console.error('Error al obtener el crédito:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});





module.exports = router;
