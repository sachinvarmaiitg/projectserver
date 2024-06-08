const mongoose = require('mongoose');
const {Schema}= mongoose;
const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true, 
    unique: true,
  },
  departureAirport: {
    type: String,
    required: true,
    trim: true,
  },
  arrivalAirport: {
    type: String,
    required: true,
    trim: true,
  },
  departureDateTime:{
    type: Date,
    required: true,
  },
 prevdepartureDateTime:{
    type: Date,
    required: true,
  },
  prevarrivalDateTime:{
    type: Date,
    required: true,
  },
  arrivalDateTime:{
    type: Date,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  baggage:{
    type:[String],
    required: true,
  },
  availableSeats:{
    type:Number,
    required: true,
    default:90,
    min:1
  },
  cancel:{
    type:String,
    required: true,
  },
  seatClass: {
    type: String,
    default:'Economy',
    required:true
  },
  reviews:[
{type:Schema.Types.ObjectId,
        ref:"Review"}
      ]
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
