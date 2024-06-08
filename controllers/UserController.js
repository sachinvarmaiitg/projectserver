const Flight=require('../models/flight');
const convertToDateTime=require('../config/convertToDateTime');
const admin=require('../config/firebaseadmin');
const Trip=require("../models/trips");
const Booking =require("../models/booking");
const Review=require("../models/review");
const Notification = require('../models/notifications');

module.exports.GetCities=async (req,res)=>{
    try{
        const response=await Flight.find().select('departureAirport arrivalAirport');
        const cities=[];
        response.map((f)=>{
            cities.push(f.departureAirport)
            cities.push(f.arrivalAirport);
        })
        const newcities=cities.filter((item,index)=>cities.indexOf(item)===index);
        res.send(newcities);

    }catch(err){
        res.status(500).json({msg:"error fetching cities"});
    }
}

module.exports.GetResults=async (req,res)=>{
        let {way,from,to,dd,rd,adult,child,Class}=req.body;
        const todaydate=new Date();
        const departureDate=new Date(dd);
        const newdate=new Date(departureDate.getFullYear(), departureDate.getMonth(), departureDate.getDate(), todaydate.getHours(), todaydate.getMinutes(), todaydate.getSeconds()); 
            if(way==='oneway'){
                const resp = await Flight.find({
                departureAirport: from,
                arrivalAirport: to,
                seatClass: Class,
                availableSeats: { $gte: adult + child },
            }).populate('reviews');
           const newresp = resp.filter((r) => {
            const rDate = new Date(r.departureDateTime);
            const newDate = new Date(newdate);
            return rDate.toLocaleDateString() === newDate.toLocaleDateString() &&
                rDate.getTime() > todaydate.getTime(); // Compare times using getTime()
            });
                res.send(newresp)
            }
            // else{
            //     const r1=await Flight.find({departureAirport:from,arrivalAirport:to,seatClass:Class,availableSeats:{$gte:adult+child},
            //     $expr: {
            //     $eq: [
            //     { $dateToString: { format: "%Y-%m-%d", date: "$departureDateTime" } }, 
            //     date1],
            //     }
                
            //     });
            //     const r2=await Flight.find({departureAirport:to,arrivalAirport:from,seatClass:Class,availableSeats:{$gte:adult+child},
            //     $expr: {
            //     $eq: [
            //     { $dateToString: { format: "%Y-%m-%d", date: "$departureDateTime" } }, 
            //     rd],
            // }
            //     });
            //     r1.sort((a, b) => Number(a.price) - Number(b.price));
            //     r2.sort((a, b) => Number(a.price) - Number(b.price));
                
            //     if (r1.length === r2.length) {
            //     } else if (r1.length > r2.length) {
            //         const diff = r1.length - r2.length;
            //         for (let i = 0; i < diff; i++) {
            //             r1.pop();
            //         }
            //     } else {
            //         const diff = r2.length - r1.length;
            //         for (let i = 0; i < diff; i++) {
            //             r2.pop();
            //         } 
            //     }
            //     const pairedFlights = [];
            //     for (let i = 0; i < r1.length; i++) {
            //         pairedFlights.push({going:r1[i],return:r2[i]});
            //     }
            //     console.log(pairedFlights);
            //     res.send(pairedFlights);
            // }
    
}

module.exports.CancelTrip=async(req,res)=>{
    try{
        let {id1,id2,id3,id4}=req.params;
        let pass=await Booking.findById(id2);
        const seats=pass.adultDetails.length+pass.childDetails.length;
        await Flight.findByIdAndUpdate(id3,{ $inc: { availableSeats:seats  } })
        await Booking.findByIdAndUpdate(id2,{Cancelled:"YES"});
        await Trip.deleteOne({ _id:id1,userid:id4});
        res.send("Succesfully deleted");
        
    }catch(err){
        res.status(500).json({msg:"server error! retry after sometime"});
    }
}


module.exports.FlightBookReview=async (req,res)=>{
    const {id}=req.params;
    const flight=await Flight.findById(id);
    if(new Date(flight.departureDateTime)<new Date()){
        res.status(404).json({msg:"flight does not existed"});
    }
    else{
        res.send(flight);
    }
    
}

module.exports.GetUpcomingBookings=async(req,res)=>{
    try{
        const uid=req.headers.authorization;
        const todaydate=new Date();
        const Trips=await Trip.find({userid:uid,status:"Upcoming"}).populate('booking').populate('flightid');
        Trips.sort((a,b)=>a.departureDateTime-b.departureDateTime);
        res.send(Trips);
    }catch(err){
        res.status(500).json({msg:"Server error!"})
    }
}


module.exports.GetCompletedTrips=async(req,res)=>{
    try{
        const uid=req.headers.authorization;
        const todaydate=new Date();
        const Trips=await Trip.find({userid:uid,status:"Completed"}).populate('booking').populate('flightid');
        Trips.sort((a,b)=>a.departureDateTime-b.departureDateTime);
        res.send(Trips);
    }catch(err){
        res.status(500).json({msg:"Server error!"})
    }
}

module.exports.PostReview=async(req,res)=>{
    try{
        let {tripid,rating,text}=req.body;
        if(req.headers.authorization){
            const user=await Review.find({userid:req.headers.authorization,tripid})
            console.log(user);
            if(user.length==0){
                const rev= new Review({comment:text,rating,userid:req.headers.authorization,tripid});
                const trip=await Trip.findById(tripid);
                const flight=await Flight.findById(trip.flightid);
                flight.reviews.push(rev);
                await rev.save(); 
                await flight.save();
                res.send("saved");
            }else{
                res.status(404).json({msg:"already submited"})
            }
        }else{
            res.status(401).json({msg:"not authorized"});
        }
        
    }catch(err){
        res.status(404).json({msg:"something went wrong! retry"})
    }
    
}

module.exports.CheckReview=async(req,res)=>{
    try{
    let {trip}=req.body;
    let userid=req.headers.authorization
    const review = await Review.find({userid,tripid:trip});
    if(review){
        res.send(review);
    } 
    }catch(err){
        console.log(err);
    }

}
//57827
module.exports.UpdateTrips=async(req,res)=>{
    try{
    let date=new Date();
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 48 * 60 * 60 * 1000);
    await Trip.updateMany({departureDateTime:{$lte:date}},{ $set: { status: 'Completed' } });
    const trips=await Trip.find({status:"Upcoming",departureDateTime:{$lte:futureTime},checkedin:false}).populate('flightid')
     if(trips.length!==0){
         const userNotification = trips.map(trip => ({
            user: trip.userid,
            message: `Webcheck in for Flight from ${trip.flightid.departureAirport} to ${trip.flightid.arrivalAirport} is open now, kindly checkin.`
        }));
        await Notification.insertMany(userNotification);
        await Trip.updateMany({status:"Upcoming",departureDateTime:{$lte:futureTime},checkedin:false},{checkedin:true});
     }
   
    }catch(err){
        console.log(err);
    }
}

module.exports.GetNotifications=async(req,res)=>{
    try{
    const user=req.headers.authorization;
    let notifications=await Notification.find({user});
    res.send(notifications);
    }catch(err){
        console.log(err);
    }
}
module.exports.ClearNotifications=async(req,res)=>{
    try{
    const user=req.headers.authorization;
    await Notification.deleteMany({user});
    res.send("deleted");
    }catch(err){
        console.log(err);
    }
}