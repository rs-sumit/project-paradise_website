const express=require("express");
const router=express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const {isSignedin,isAccess}=require("../middlewere.js");
const listingController=require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");
const multer=require("multer");
const upload=multer({storage});  //for saving in own server at the place of {storage} we should use {dest:"upload/"}



//All listing
router
.route("/")
.get(asyncWrap(listingController.homepage));


//add listing
router
  .route("/new")
  .get(isSignedin, listingController.newlistingform)
  .post(isSignedin, upload.single('listing[image][url]'),
  asyncWrap(listingController.newpost));
 


router; 
router
  .route("/:_id")
  .get(asyncWrap(listingController.detailview))
  .delete(
    isSignedin,
    isAccess,
    asyncWrap(listingController.deletelisting)
  );


//edit listing
router
  .route("/:_id/edit")
  .get(listingController.editform)
  .put(
    isSignedin,
    isAccess,
    upload.single('listing[image][url]'),
    asyncWrap(listingController.updatelisting)
  );


module.exports=router;
