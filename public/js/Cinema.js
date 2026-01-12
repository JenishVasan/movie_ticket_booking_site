const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: String
});

module.exports = mongoose.model('Cinema', cinemaSchema);