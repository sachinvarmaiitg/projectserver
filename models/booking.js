const mongoose = require('mongoose');
const { Schema } = mongoose;

// Assuming you already have a Flight model
const Flight = require('./flight');

const AdultDetailsSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    aadhar: { type: String, required: true },
});

const ChildDetailsSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

const BookingSchema = new Schema({
    flight: [{type: Schema.Types.ObjectId, ref: 'Flight' }],
    paymentId: { type: String, required: true },
    adultDetails: [AdultDetailsSchema],
    childDetails: [ChildDetailsSchema],
    bookingDate: { type: Date, default: new Date() },
    totalPrice: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    Cancelled:{type:String, default:"NO"  },
    // Add other necessary fields
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
