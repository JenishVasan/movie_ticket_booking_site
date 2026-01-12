const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    price: {
        REGULAR: { type: Number, required: true },
        PREMIUM: { type: Number, required: true },
        RECLINER: { type: Number, required: true }
    },

    bookedSeats: [String] // ["A1", "A2"]
}, { timestamps: true });

module.exports = mongoose.model("Show", showSchema);
