const express = require('express');
const { createStats, getStats, getLastEvents } = require('./stats.controllers.js');

const statsRouter = express.Router();

statsRouter.post('/create', createStats);
statsRouter.get('/get', getStats);
statsRouter.get('/last-events', getLastEvents);

module.exports = { statsRouter };
