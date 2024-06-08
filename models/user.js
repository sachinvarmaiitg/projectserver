const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
      type:String,
      required:true,
      dropDups:true,
      unique:true
  },
  bookingHistory: [{
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    passengers: [{
      name: String,
      age: Number,
      seatNumber: String
    }],
    totalPrice: Number
  }],
  upcomingFlights: [{
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight'
    },
    departureDate: Date,
    arrivalDate: Date,
    seatNumber: String
  }],
   preferences: {
    seatClass: { type: String, enum: ['Economy', 'Business', 'First Class'], default: 'Economy' },
    mealPreference: { type: String, default: 'Standard' },
    specialAssistance: { type: Boolean, default: false },
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
