const express = require('express');
const { getAllJerseys, getJerseysByTeam, getJerseysByID, getJerseysBySeason, getJerseysByColour, getJerseysByLeague, createJersey } = require('./jersey.controllers.js');

const jerseyRouter = express.Router();

jerseyRouter.get('/', getAllJerseys);
jerseyRouter.get('/league/:league', getJerseysByLeague);
jerseyRouter.get('/colour/:colour', getJerseysByColour);
jerseyRouter.get('/team/:team', getJerseysByTeam);
jerseyRouter.get('/:id', getJerseysByID);
jerseyRouter.get('/season/:season', getJerseysBySeason);

jerseyRouter.post('/', createJersey);

module.exports = { jerseyRouter };