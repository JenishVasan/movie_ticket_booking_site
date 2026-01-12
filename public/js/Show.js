const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    priceRegular: Number,
    pricePremium: Number,
    priceRecliner: Number,
    seatsBooked: [String] // Array of seat IDs like "A1", "B2"
});

module.exports = mongoose.model('Show', showSchema);