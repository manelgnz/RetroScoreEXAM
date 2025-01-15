const express = require('express');
const { createStat, getStats, getLastEvents } = require('./stats.controllers.js');

const statsRouter = express.Router();

statsRouter.post('/create', createStat);
statsRouter.get('/get', getStats);
statsRouter.get('/last-events', getLastEvents);

module.exports = { statsRouter };
