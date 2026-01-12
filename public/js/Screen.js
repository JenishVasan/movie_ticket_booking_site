const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rows: { type: Number, required: true },
    columns: { type: Number, required: true },
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    seats: [[Number]] // 2D array: 1 = seat, 0 = gap
});

module.exports = mongoose.model('Screen', screenSchema);