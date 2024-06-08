const express=require('express');
const router=express.Router();
const { adminAuthMiddleware } = require('../middlewares/isAuth');
const AdminController=require("../controllers/AdminController");

router.post("/addflight", adminAuthMiddleware,AdminController.AddFlight);

router.get("/allusers",adminAuthMiddleware,AdminController.GetUsers);

router.get('/activeflights',AdminController.GetActiveFlights);

router.post("/editFlight",adminAuthMiddleware,AdminController.EditFlight);

router.get("/getbookings",adminAuthMiddleware,AdminController.GetAllBookings);


module.exports=router;