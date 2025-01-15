const mongoose = require('mongoose');
const { StatsModel } = require('./stats.model.js');

async function createStat(req, res) {
    const { _id, sessionId, userId, llocEvent, tipusEvent } = req.body;

    if (!_id || !sessionId || !llocEvent || !tipusEvent) {
        return res.status(400).json({
            message: 'Faltan campos requeridos: _id, sessionId, llocEvent, tipusEvent.',
        });
    }

    try {
        const newStat = new StatsModel({
            _id,
            sessionId,
            userId: userId || null, // null si no està registrat
            llocEvent,
            tipusEvent,
            createdAt: new Date(),
        });

        const savedStat = await newStat.save();
        res.status(201).json({ message: 'Estadística creada con éxito.', stat: savedStat });
    } catch (error) {
        console.error('Error al crear estadística:', error);
        res.status(500).json({ message: 'Error al crear estadística.', error: error.message });
    }
}

async function getStats(req, res) {
    const { dataInici, dataFinal, llocEvent, tipusEvent } = req.query;

    try {
        // filtres dinàmics
        const filters = {};
        if (dataInici) filters.createdAt = { $gte: new Date(dataInici) };
        if (dataFinal) filters.createdAt = { ...filters.createdAt, $lte: new Date(dataFinal) };
        if (llocEvent) filters.llocEvent = llocEvent;
        if (tipusEvent) filters.tipusEvent = tipusEvent;

        // Buscar estadístiques segons el filtre
        const stats = await StatsModel.find(filters);

        // Calcular n visites y clics
        const visits = stats.filter(stat => stat.tipusEvent === 'visita').length;
        const clicks = stats.filter(stat => stat.tipusEvent === 'click').length;

        res.status(200).json({ visits, clicks });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas.', error: error.message });
    }
}

async function getLastEvents(req, res) {
    const { dataInici, dataFinal, llocEvent, tipusEvent, limit = 10 } = req.query;

    try {
        // filtres dinàmics
        const filters = {};
        if (dataInici) filters.createdAt = { $gte: new Date(dataInici) };
        if (dataFinal) filters.createdAt = { ...filters.createdAt, $lte: new Date(dataFinal) };
        if (llocEvent) filters.llocEvent = llocEvent;
        if (tipusEvent) filters.tipusEvent = tipusEvent;

        // Busco y ordeno events
        const events = await StatsModel.find(filters)
            .sort({ createdAt: -1 }) // Ordenar per data descendent
            .limit(parseInt(limit));

        res.status(200).json(events);
    } catch (error) {
        console.error('Error al obtener los últimos eventos:', error);
        res.status(500).json({ message: 'Error al obtener los últimos eventos.', error: error.message });
    }
}

module.exports = {
    createStat,
    getStats,
    getLastEvents,
};
