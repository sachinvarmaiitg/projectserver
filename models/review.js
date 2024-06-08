
const mongoose=require('mongoose');
const {Schema}=require('mongoose');
const review=new Schema({
    userid:{
        type:String,
    },
    tripid:{
        type: Schema.Types.ObjectId, ref: "Trip" 
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:String,
    created_at:{
        type:Date,
        default:Date.now()
    },
});

const Review = mongoose.model('Review', review);

module.exports = Review;

