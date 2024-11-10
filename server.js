const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Rutas para admin
const userRoutes = require('./routes/user'); // Rutas para usuarios
const creditRoutes = require('./routes/credit'); // Asegúrate de que esta es la única ruta para creditos

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.dr4vyfo.mongodb.net/PagaDiario?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB y a la base de datos PagaDiario'))
.catch(err => console.error('Error de conexión:', err));

// Rutas
app.use('/api/admin', authRoutes); // Ruta para las operaciones de admin
app.use('/api/user', userRoutes); // Ruta para las operaciones de user
app.use('/api/credit', creditRoutes);// Ruta para manejar créditos



app.get('/', (req, res) => {
    res.send('API de la aplicación contable online');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
