const { model } = require("mongoose");
const Listing=require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};


module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

    let listing=req.body.listing;
    const newListing=new Listing(listing);
    newListing.owner=req.user._id;  
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New listings created");
    res.redirect("/listings");  

   
};
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    };
    // console.log(listing);
    res.render("listings/show.ejs",{ listing, currUser: req.user });
};
module.exports.editListing=async(req,res)=>{
     let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing){
        req.flash("error","Listing you requested does not exist");
       return res.redirect("/listings");
    };
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_250,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};
// module.exports.updateListing=async(req,res)=>{
    
//     let {id}=req.params;
//     let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     if(typeof req.file !=="undefined"){
//          let url=req.file.path;
//     let filename=req.file.filename;
//     listing.image={url,filename};
//     await listing.save();
//     }
//     req.flash("success"," listings Updated");
//     res.redirect(`/listings/${id}`);
// };
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) throw new ExpressError(400, "Invalid listing data");
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listings Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
   let {id}=req.params;
  let deletedListing= await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
  req.flash("success","listings deleted");
  res.redirect("/listings");
};