const mongoose = require('mongoose');

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true // El campo es obligatorio
    },
    email: {
        type: String,
        required: true,
        unique: true // El correo debe ser único
    },
    cartId: {
        // Referencia al carrito
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart' // Nombre del modelo de carrito al que hace referencia
    },

}, { timestamps: true }); // Añade createdAt y updatedAt automáticamente

const UserModel = mongoose.model('User', userSchema);

// Exportar el modelo
module.exports = { UserModel };
