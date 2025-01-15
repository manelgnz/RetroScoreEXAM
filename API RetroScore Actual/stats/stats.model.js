const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true 
    },
    sessionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
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

const statsModel = mongoose.model('Stats', statsSchema);

module.exports = { statsSchema };

