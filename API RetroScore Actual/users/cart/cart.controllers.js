const { CartModel } = require('./cart.model.js');
const { UserModel } = require('../users.model.js'); // Asegúrate de que esta ruta sea correcta
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
    const { userId, quantity } = req.body;
    const { jerseyId } = req.params; // Obtener jerseyId de los parámetros de la ruta

    if (!userId || !jerseyId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jerseyId)) {
        return res.status(400).json({ message: 'Invalid userId or jerseyId' });
    }

    try {
        // Buscar al usuario y el carrito asociado
        const user = await UserModel.findById(userId).populate('cartId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let cart = user.cartId;

        // Si el usuario no tiene carrito, crear uno nuevo
        if (!cart) {
            cart = new CartModel({ userId, items: [] });
            await cart.save();

            // Actualizar el campo `cartId` del usuario
            user.cartId = cart._id;
            await user.save();
        }

        // Buscar el índice del artículo en el carrito
        const itemIndex = cart.items.findIndex(item => item.jerseyId.toString() === jerseyId);

        if (itemIndex > -1) {
            // Si el artículo ya existe, actualizar la cantidad
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Si no existe, agregarlo
            cart.items.push({ jerseyId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCartByUser = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
    }

    try {
        // Buscar el carrito asociado al usuario y popular detalles de los jerseys
        const user = await UserModel.findById(userId).populate({
            path: 'cartId',
            populate: {
                path: 'items.jerseyId', // Popular detalles de los jerseys
                model: 'Jersey' // Nombre del modelo de jerseys
            }
        });

        if (!user || !user.cartId) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Formatear la respuesta
        const formattedCart = {
            cartId: user.cartId._id,
            userId: user.cartId.userId,
            items: user.cartId.items.map(item => ({
                jersey: {
                    id: item.jerseyId._id,
                    team: item.jerseyId.team,
                    price: item.jerseyId.price,
                    season: item.jerseyId.season,
                    colour: item.jerseyId.colour,
                    imageURL: item.jerseyId.imageURL
                },
                quantity: item.quantity,
            }))
        };

        res.status(200).json(formattedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFromCart = async (req, res) => {
    const { jerseyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jerseyId)) {
        return res.status(400).json({ message: 'Invalid jerseyId' });
    }

    try {
        const cart = await CartModel.findOne({ 'items.jerseyId': jerseyId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.jerseyId.toString() === jerseyId);
        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                // Si la cantidad es mayor a 1, disminuir la cantidad
                cart.items[itemIndex].quantity -= 1;
            } else {
                // Si la cantidad es 1, eliminar el ítem
                cart.items.splice(itemIndex, 1);
            }

            await cart.save();
            res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Cart item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    const { userId, quantity } = req.body;
    const { jerseyId } = req.params; // Obtener jerseyId de los parámetros de la ruta

    if (!userId || !jerseyId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jerseyId)) {
        return res.status(400).json({ message: 'Invalid userId or jerseyId' });
    }

    try {
        // Buscar el carrito del usuario
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Buscar el índice del artículo en el carrito
        const itemIndex = cart.items.findIndex(item => item.jerseyId.toString() === jerseyId);

        if (itemIndex > -1) {
            // Si el artículo existe, actualizar la cantidad
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    addToCart,
    getCartByUser,
    deleteFromCart,
    updateCartItem
};
