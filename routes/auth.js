const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const SECRET_KEY = 'secret-key'; // Cambia esto en producción

// Ruta de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear un nuevo administrador (opcional, para pruebas)
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newAdmin = new Admin({ username, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Administrador creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear Administrador' });
    }
});

// Obtener todos los administradores
router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find(); // Trae todos los administradores
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los administradores' });
    }
});

// Eliminar un administrador
router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            return res.status(404).json({ message: 'Administrador no encontrado' });
        }
        res.json({ message: 'Administrador eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
