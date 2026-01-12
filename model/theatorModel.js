const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String, required: true
  },
  city: {
    type: String, required: true
  },
  address: String,
  screens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen'
    }
  ]
});

module.exports = mongoose.model("Theatre", theatreSchema);
