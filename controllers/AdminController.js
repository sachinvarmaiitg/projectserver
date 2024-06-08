const parseDateTime = require('../config/parseDateTime');
const Flight = require("../models/flight");
const Trip = require("../models/trips");
const Notification = require('../models/notifications');
const Booking=require('../models/booking');
const moment= require('moment-timezone');
const admin=require('../config/firebaseadmin')

module.exports.AddFlight=async (req, res) => {
    try {
            const { AName, Fno, DA, AA, DD, DT, AT, AD, price, checkInBag, cabinBag, cancelCharge, AS, seatClass } = req.body;
            const newFlight = new Flight({
                airline: AName,
                flightNumber: Fno,
                departureAirport: DA,
                arrivalAirport: AA,
                departureDateTime: parseDateTime(DD, DT),
                arrivalDateTime: parseDateTime(AD, AT),
                price: price,
                baggage: [checkInBag, cabinBag],
                seatClass: seatClass,
                cancel: cancelCharge,
                availableSeats: Number(AS),
                prevdepartureDateTime: parseDateTime(DD, DT),
                prevarrivalDateTime: parseDateTime(AD, AT),
            });
            console.log(newFlight.departureDateTime)
            newFlight.save()
                .then(() => res.status(200).json({ msg: "Flight saved successfully" }))
                .catch(err => res.status(409).json({ msg: "Flight validation error or flight already exists", error: err }));
    } catch (err) {
        res.status(500).json({ msg: "Internal server error ", error: err.message });
    }
}

module.exports.GetUsers=async(req,res)=>{
    try{
        const output=await admin.auth().listUsers(1000);
        res.send(output.users);
    }catch(err){
        res.status(500).json({ msg: "Internal server error ", error: err.message });
    }
}


module.exports.GetActiveFlights=async(req,res)=>{
    try{
        const resp=await Flight.find();
        resp.sort((a,b)=>b.departureDateTime-a.departureDateTime)
        res.send(resp);
    }catch(err){
        res.staus(500).json({ msg: "Internal server error! retry", error: err.message });
    }
}


module.exports.EditFlight=async(req,res)=>{
    try {
    const { flight2, id } = req.body;
    const curDate = new Date();
    const IniFlight = await Flight.findById(id);
    if (new Date(IniFlight.departureDateTime) <= curDate && new Date(IniFlight.arrivalDateTime) > curDate) {
        res.status(409).json({ msg: "flight already departured! you can edit after arrival" });
    } else {
        await Flight.findByIdAndUpdate(id, {
            departureAirport: flight2.DA,
            arrivalAirport: flight2.AA,
            departureDateTime: parseDateTime(flight2.DD, flight2.DT),
            arrivalDateTime: parseDateTime(flight2.AD, flight2.AT),
            price: flight2.price,
            baggage: [flight2.checkInBag, flight2.cabinBag],
            seatClass: flight2.seatClass,
            cancel: flight2.cancelCharge,
            availableSeats: Number(flight2.AS),
            prevarrivalDateTime: IniFlight.arrivalDateTime,
            prevdepartureDateTime: IniFlight.departureDateTime
        });

        await Trip.updateMany({ flightid: id, status: 'Upcoming' }, {
            $set: {
                departureDateTime: parseDateTime(flight2.DD, flight2.DT),
                arrivalDateTime: parseDateTime(flight2.AD, flight2.AT)
            }
        });

        const trips = await Trip.find({ flightid: id, status: 'Upcoming' });
        const userNotification = trips.map(trip => ({
            user: trip.userid,
            message: `Flight from ${flight2.DA} to ${flight2.AA} has been Rescheduled`
        }));
        await Notification.insertMany(userNotification);
        res.send("updated");
    }
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }

}


module.exports.GetAllBookings=async (req,res)=>{
    try{
        const re=await Booking.find()
        re.sort(((a,b)=>b.bookingDate-a.bookingDate))
        res.send(re);
    }catch(err){
        res.status(500).json({msg:"Sorry,Server error!"})
    }
    
}