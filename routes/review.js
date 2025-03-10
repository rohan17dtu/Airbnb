const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');


const {validateReview, isLoggedIn, isOwner, isReviewAuthor} =require("../middleware.js");
const reviewController = require("../controller/reviews.js");


//review route
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.addReview));
    
//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;