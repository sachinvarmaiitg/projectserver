require('dotenv').config();
const express = require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser')
const dbURL=process.env.ATLAS_URL;
corsOptions ={
    origin:'http://localhost:3000', 
        withcredentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
        methods:["POST","GET","DELETE"],
    }
const {isLoggedIn,isAdmin} =require('./middlewares/isAuth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const adminRouter=require("./routes/admin");
const userRouter=require("./routes/userTrip");
const paymentRouter=require("./routes/payment");
main(
    console.log("connection succeed")
).catch(err => console.log(err));


async function main() {
  await mongoose.connect(dbURL);
}

app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.post("/gettoken",isLoggedIn)
app.use("/admin",adminRouter)
app.use("/users",userRouter);
app.use("/payment",paymentRouter);
app.get("/",(req,res)=>{
    res.send("path does not exist");
})
app.listen(8000,()=>{
    console.log("App is listening to port 8080");
})
