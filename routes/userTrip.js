const express=require('express');
const router=express.Router();

const UserController=require('../controllers/UserController');
const { isauthMiddleware } = require('../middlewares/isAuth');

router.get("/getcities",UserController.GetCities);
router.post("/searchresults",isauthMiddleware,UserController.GetResults);
router.delete("/cancel/:id1/:id2/:id3/:id4",isauthMiddleware,UserController.CancelTrip);
router.get("/getbreview/:id",UserController.FlightBookReview);
router.get("/getupcomingtrips",UserController.GetUpcomingBookings);
router.get("/getcompTrips",UserController.GetCompletedTrips);
router.post("/postreview",UserController.PostReview);
router.post("/isreviewSubmit",UserController.CheckReview);
router.get("/updateTrips",UserController.UpdateTrips);
router.get('/notifications',UserController.GetNotifications);
router.get('/clearNoti',UserController.ClearNotifications);

module.exports=router;