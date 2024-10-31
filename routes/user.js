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

// Eliminar un usuarios
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'usuario no encontrado' });
        }
        res.json({ message: 'usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para obtener los números de identificación de todos los usuarios
router.get('/identifications', async (req, res) => {
    try {
        const users = await User.find({}, 'identificationNumber fullName');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener identificaciones:', error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;
