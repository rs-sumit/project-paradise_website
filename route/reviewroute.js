const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap = require("../utils/asyncWrap.js");
const { isSignedin, isReviewAuther } = require("../middlewere.js");
const reviewController=require("../controllers/review.js");


router.post(
  "/",
  isSignedin,
  asyncWrap(reviewController.reviewposting)
);

//delete review
router.delete(
  "/:reviewId/Destroy",
  isSignedin,
  isReviewAuther,
  asyncWrap(reviewController.reviewdestroying)
);


module.exports=router;