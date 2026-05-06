const mongoose = require('mongoose')


const ticketSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
        seatNumber: { type: String, required: true }, 
        row: { type: String },  
        price: { type: Number, required: true }  
      }
    ],

    status: {
      type: String,
      enum: ['BOOKED', 'CANCELLED'],
      default: 'BOOKED'
    },

    totalAmount: {
      type: Number,
      required: true,
      default: 0
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
