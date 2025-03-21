const Listings=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    let allListings= await Listings.find();
  
    res.render("listings/index.ejs",{allListings});
    };

module.exports.renderNewForm=(req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res,next)=>{
    let {id}=req.params;
    
    const showlisting= await Listings.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    
   
    if(!showlisting){
        req.flash("error","listing you requested that doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{showlisting})
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
   
    const newlisting=new Listings(req.body.listing);
   
    
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new listing is created!!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res,next)=>{
    let {id}=req.params;
   
    let oldlisting=await Listings.findById(id);
    if(!oldlisting){
      req.flash("error","listing you requested that doesn't exist");
     return  res.redirect("/listings");
  }
  let originalImageUrl=oldlisting.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300");
   
    res.render("listings/edit.ejs",{oldlisting,originalImageUrl});
  }

module.exports.updateListing=async(req,res,next)=>{
    let {id}=req.params;
    if(!req.body.listing){
        throw  new ExpressError(400,"send valid data for listing")
     }
    
    
    let updatelisting=req.body.listing;
   
   let listing= await Listings.findByIdAndUpdate(id,{...updatelisting});

   if(typeof req.file !=="undefined" ){
    let url=req.file.path;
    let filename=req.file.filename;
   
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","listing is updated!!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res,next)=>{
    let {id}=req.params;
   
   let deleted= await Listings.findByIdAndDelete(id);
 
  req.flash("success","listing is deleted!!");
    res.redirect("/listings");
}