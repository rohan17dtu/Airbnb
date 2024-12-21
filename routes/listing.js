const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const {isLoggedIn ,isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key : process.env.API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'wanderlust_DEV',
//       allowedFormats :["jpg","jpeg","png"]
     
//     },
//   });
const upload = multer({ storage });



//index route
router.get('/', wrapAsync(listingController.index));
    
//new route
router.get("/new",isLoggedIn ,wrapAsync(listingController.renderNewForm));
    
//show route
router.get('/:id', wrapAsync (listingController.showListing));

//create route
router.post("/", isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync (listingController.createListing));

 
//edit route
 router.get("/:id/edit" ,isLoggedIn,isOwner , wrapAsync (listingController.editForm));
 
//update route 
 router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,  wrapAsync (listingController.updateListing));
 
//destroy route
 router.delete("/:id", isLoggedIn,isOwner , wrapAsync(listingController.deleteListing));
 
 
module.exports= router;