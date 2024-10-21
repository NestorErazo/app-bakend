const express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Crear un nuevo usuario
router.post('/register', async (req, res) => {
    const { fullName, email, identificationNumber, phone, address } = req.body;

    try {
        const newUser = new User({ fullName, email, identificationNumber, phone, address });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El usuario ya está registrado con este email o identificación.', error });
        }
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
});

module.exports = router;
