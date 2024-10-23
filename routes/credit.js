const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Importar el modelo de usuario
const Credit = require('../models/Credit'); // Importar el modelo de crédito

// Crear un nuevo crédito para un usuario
router.post('/:identificationNumber/add-credit', async (req, res) => {
    const { identificationNumber } = req.params; // Obtener el número de identificación de los parámetros
    const { loanAmount, interestRate } = req.body; // Obtener los datos del crédito del cuerpo de la solicitud

    // Verifica si los campos loanAmount e interestRate están presentes y son válidos
    if (typeof loanAmount !== 'number' || typeof interestRate !== 'number') {
        return res.status(400).json({ message: 'Faltan campos requeridos: loanAmount, interestRate' });
    }

    try {
        // Busca el usuario por el número de identificación
        const user = await User.findOne({ identificationNumber });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Crear el nuevo crédito
        const newCredit = new Credit({
            user: user._id, // Guardar la referencia al usuario
            loanAmount,
            interestRate,
        });

        // Guardar el nuevo crédito
        await newCredit.save();

        // Agregar el nuevo crédito al usuario
        user.credits.push(newCredit._id);
        await user.save();

        res.status(201).json({ message: 'Crédito añadido exitosamente', credit: newCredit });
    } catch (error) {
        console.error('Error al añadir crédito:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;
