const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true     
    },
    durationH: { 
        type: Number, 
        required: true
    },
    durationM :{
        type: Number, 
        required: true
    },
    language: [String],
    genre: [String],
    releaseDate: Date,
    poster: String,
    trailerUrl: String,
    rating: { 
        type: Number, min: 0, max: 10 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
