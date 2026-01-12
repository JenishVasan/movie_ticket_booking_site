const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
  name: String, // Screen 1, Audi 2
  totalSeats: Number,
  rows: Number,
  columns: Number,
  seatLayout: [{
    seatNumber: String, // A1, A2
    row: String,
    type: { type: String, enum: ['REGULAR', 'PREMIUM', 'RECLINER'] },
    isBooked: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model("Screen", screenSchema);