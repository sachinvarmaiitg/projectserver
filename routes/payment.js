const express=require('express');
require("dotenv").config();
const router=express.Router();
const convertToDateTime=require('../config/convertToDateTime');
const Flight=require('../models/flight');
const Trip=require("../models/trips");
const Booking =require("../models/booking");
const jwt=require('jsonwebtoken');
const Razorpay=require('razorpay');
const crypto=require('crypto');
router.post("/getorderid",async(req,res)=>{
    try{
        console.log(process.env.RAZORPAY_KEY_ID)
        const razorpay= new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_SECRET
    })
    const options=req.body;
    const order=await razorpay.orders.create(options)
    if(!order){
        
        return res.status(500).send("Payment cannot completed");
    }
    res.json(order);
    }catch(err){
        console.log(err);
        return res.status(500).send("Payment cannot completed");
    }
    
})

router.post("/validatePayment",(req,res)=>{
    try{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;
    const sha = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest= sha.digest("hex");
    if((digest!==razorpay_signature)){
        return res.status(400).json({msg:"Transaction Failed"});
    }
    const token=jwt.sign({id:razorpay_payment_id},process.env.JWT_SECRET,{expiresIn:15});
   req.session.token=token;
    res.json({
        msg:"success",
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id,
    })
    }catch(err){
        console.log(err)
        res.status(404).json({msg:"payment failed!"})
    }
    
})

router.post("/addbooking",async(req,res)=>{
      
    try{
  
    const token=req.session.token;
   let {flightid1,flightid2,paymentId,travellerDetails,currUser}=req.body;
     if(!token){
        res.status(401).json("token not valid");
    }else{
        jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
            if(err)return res.status(401).json("token is wrong");
            else{
                var passengers;
                if(travellerDetails){
                    passengers=travellerDetails[0].length+travellerDetails[1].length;
                }
                const booking=await Booking.find({paymentId:paymentId})        
                if(booking.length===0){
                    const flight=await Flight.findByIdAndUpdate(flightid1,{ $inc: { availableSeats: -passengers } },{new:true});
                    var flight2=null;
                    var departureDatereturn=null;
                    var arrivalDatereturn=null;
                    if(flightid2){
                        console.log(flightid2);
                        flight2=await Flight.findByIdAndUpdate(flightid2,{ $inc: { availableSeats: -passengers } },{new:true});
                        departureDatereturn=flight2.departureDateTime;
                        arrivalDatereturn=flight2.arrivalDateTime;
                    }
                    const departureDate=flight.departureDateTime;
                    const arrivalDate=flight.arrivalDateTime;
                    const newbooking=new Booking({flight:[flightid1,flightid2],paymentId:paymentId,adultDetails:travellerDetails[0],childDetails:travellerDetails[1],contactEmail:travellerDetails[3].email,contactPhone:travellerDetails[3].mobile,totalPrice:travellerDetails[2].amount/100})
                    newbooking.save().then((r)=>{
                        const newtrip1=new Trip({booking:r._id,flightid:flight._id,userid:currUser.uid,departureDateTime:departureDate,arrivalDateTime:arrivalDate,predepartureDateTime:departureDate,prearrivalDateTime:arrivalDate});
                        newtrip1.save().then(()=>console.log("trip1 save"));
                        if(flightid2){
                            const newtrip2=new Trip({booking:r._id,flightid:flight2._id,userid:currUser.uid,departureDateTime:departureDatereturn,arrivalDateTime:arrivalDatereturn,predepartureDateTime:departureDatereturn,prearrivalDateTime:arrivalDatereturn});
                            newtrip2.save().then(()=>console.log("trip2 save"));
                        }
                        res.send({bookingid:r._id,flight:flight,flight2:flight2});
                    });
                    
                }  
            }
        })
    }
    }catch(err){
        console.log(req.session)
        console.log(err);
    }
})

module.exports=router;
