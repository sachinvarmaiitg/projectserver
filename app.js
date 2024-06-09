require('dotenv').config();
const express = require('express');
const app=express();
const cors=require('cors');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser=require('body-parser')
const dbURL=process.env.ATLAS_URL;
const corsOptions ={
        origin:'https://projectclientside.vercel.app',
        optionSuccessStatus:200,
        methods:["POST","GET","DELETE"],
    }
const {isLoggedIn,isAdmin} =require('./middlewares/isAuth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const adminRouter=require("./routes/admin");
const userRouter=require("./routes/userTrip");
const paymentRouter=require("./routes/payment");
const store=MongoStore.create({
  mongoUrl:process.env.MONGODB_URI,
  touchAfter:24*3600,
  crypto:{
    secret:"mysupersecretcode",
  }
})
const sessionOptions={
  store:store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*3600*1000,
    maxAge:7*24*3600*1000,
    httpOnly:true
  },
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));
main(
    console.log("connection succeed")
).catch(err => console.log(err));


async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

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
