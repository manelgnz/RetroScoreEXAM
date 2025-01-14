// Ejemplo de cómo podría estar definido el modelo de carrito
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [{ jerseyId: mongoose.Schema.Types.ObjectId, quantity: Number }]
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = { CartModel };
