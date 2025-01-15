const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({

    sessionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: false
    },
    llocEvent: {
        type: String,
        required: true
    },
    tipusEvent: { 
        type: String,
        enum: ['visita', 'click'], // Enumerat: 'visita' | 'click'
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
},);

const StatsModel = mongoose.model('Stats', statsSchema);

module.exports = { StatsModel };

