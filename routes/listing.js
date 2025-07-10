const express=require("express");
const{model}=require("mongoose");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const{isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({storage });


router
.route("/")
.get(wrapAsync(listingController.index))   //index route
.post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing

));//create route


router.get("/new",isLoggedIn,listingController.renderNewForm);//new route

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))   //update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//delete route

// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports=router;