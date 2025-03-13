const Review=require("../models/review.js");
const Listings=require("../models/listing.js");


module.exports.createReview=async(req,res)=>{
    let listing=await Listings.findById(req.params.id);
 
    let newreview= new Review(req.body.review);
    newreview.author=req.user._id;
    
    await newreview.save();
   
    listing.reviews.push(newreview);
    await listing.save();
    req.flash("success","new review is created!!");
   
    res.redirect(`/listings/${req.params.id}`);
 
 }

 module.exports.destroyReview=async (req,res)=>{
    let{id,reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review is deleted!!");
    res.redirect(`/listings/${id}`);

}