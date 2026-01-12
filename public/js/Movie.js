const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: String,
    language: String,
    rating: Number,
    durationHour: Number,
    durationMinute: Number
});

module.exports = mongoose.model('Movie', movieSchema);