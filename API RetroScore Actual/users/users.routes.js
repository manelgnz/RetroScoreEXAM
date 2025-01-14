const express = require('express');
const { handleGetUsers, handleGetUser, createUser, loginUserPlain } = require('./users.controllers.js');

const usersRouter = express.Router();

usersRouter.get('/', handleGetUsers);
usersRouter.get('/:id', handleGetUser);
usersRouter.post('/register', createUser);
usersRouter.post('/loginPlain', loginUserPlain);

module.exports = { usersRouter };
