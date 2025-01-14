const { UserModel } = require('./users.model.js');
const { CartModel } = require('./cart/cart.model.js'); // Asegúrate de que esta ruta sea correcta
const mongoose = require('mongoose');

async function handleGetUsers(req, res) {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
}

async function handleGetUser(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    try {
        const foundUser = await UserModel.findById(id);
        if (!foundUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(foundUser);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
}

async function createUser(req, res) {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(409).send('Este email ya está registrado');
    }

    // Crear un nuevo usuario primero
    const newUser = new UserModel({
        email: req.body.email,
        password: req.body.password,
    });

    await newUser.save(); // Guardar el nuevo usuario

    // Crear un nuevo carrito y asignar el userId
    const newCart = new CartModel({ userId: newUser._id }); // Asignar el userId del nuevo usuario
    await newCart.save();

    // Actualizar el usuario con el cartId
    newUser.cartId = newCart._id; // Asignar el ID del nuevo carrito
    await newUser.save(); // Guardar el usuario nuevamente con el cartId

    res.status(201).json(newUser);
}

async function loginUserPlain(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email y contraseña son requeridos');
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).send('Usuario o contraseña incorrectos');
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', user: { email: user.email, cartId: user.cartId, userId: user.id } });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}

module.exports = {
    handleGetUsers,
    handleGetUser,
    createUser,
    loginUserPlain,
};
