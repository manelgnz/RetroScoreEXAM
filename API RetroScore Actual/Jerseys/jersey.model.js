const { Schema, model } = require('mongoose');

const jerseySchema = new Schema({
    team: { type: String, required: true },
    price: { type: Number, required: true },
    season: { type: String, required: true },
    league: { type: String, required: true },
    colour: { type: String, required: true },
    imageURL: { type: String, required: true },
    // sizes: { type: [String], required: true }, 
    //description: { type: String },
}, { timestamps: true });

const JerseyModel = model('Jersey', jerseySchema);

module.exports = { JerseyModel };