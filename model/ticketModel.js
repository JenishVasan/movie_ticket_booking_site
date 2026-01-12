const mongoose = require('mongoose')


const ticketSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true
    },

    seats: [
      {
        seatNumber: { type: String, required: true }, // A1, B4
        row: { type: String }, // optional
        price: { type: Number, required: true } // snapshot price
      }
    ],

  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
