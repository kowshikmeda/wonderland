// const { string, date } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const reviewSchema=new mongoose.Schema({
    comment:{
        type:String,
        required: [true, "Comment is required"],
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

});
let Review= mongoose.model("Review",reviewSchema);
module.exports=Review;