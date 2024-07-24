const listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const listingSchema = require("../schema/schema.js");
const updateSchema = require("../schema/updateSchema.js");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geocodingClint=mbxGeocoding({accessToken:mapToken});

module.exports.homepage = async (req, res) => {
  let Listings = await listing.find();
  res.render("./listing/index", { Listings });
};

module.exports.newlistingform = (req, res) => {
  res.render("./listing/new");
};

module.exports.newpost=async(req,res,next)=>{
        let result = listingSchema.validate(req.body);
        if (result.error){throw new expressError(400,result.error);}
        let newListing = req.body.listing;
        newListing.owner=req.user._id;
         let response=await geocodingClint.forwardGeocode({
          query:req.body.listing.location,
          limit:1
        }).send();
        newListing.geometry = response.body.features[0].geometry;
        if(typeof req.file!="undefined"){
          newListing.image.url = req.file.path;
        }
        let savedlisting=await new listing(newListing).save();
        req.flash("success","New Listing is added successfully!");
        res.redirect("/listing");
    
     
};

module.exports.detailview = async (req, res) => {
  let { _id } = req.params;
  let id = await listing
    .findById(_id)
    .populate({ path: "reviews", populate: "auther" })
    .populate("owner");
  if (!id) {
    req.flash("error", "The Listing You are try to reach isn't exist!");
    res.redirect("/listing");
  }
  res.render("listing/show", { id });
};


module.exports.editform = async (req, res) => {
  let { _id } = req.params;
  let id = await listing.findById(_id);
  let originalUrl=id.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");


  if (!id) {
    req.flash("error", "The Listing You are try to reach isn't exist!");
    res.redirect("/listing");
  }
  res.render("listing/edit", { id, originalUrl });
};

module.exports.updatelisting = async (req, res, next) => {
  
  let result = updateSchema.validate(req.body.listing);
  if (result.error) {
    throw new expressError(400, result.error);
  }
  let { _id } = req.params;

  let updatedId=await listing.findByIdAndUpdate(_id , req.body.listing, { runValidators: true });
  if (typeof req.file !== "undefined") {
  let url=req.file.path;
  let filename=req.file.filename;
    updatedId.image = {url,filename};
  }
  let response = await geocodingClint
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  updatedId.geometry = response.body.features[0].geometry;
  await updatedId.save();
  req.flash("success", "The Listing is updated successfully!");
  res.redirect(`/listing/${_id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { _id } = req.params;
  let dellisting = await listing.findByIdAndDelete({ _id });
  req.flash("success", "The Listing is Deleted successfully!");
  res.redirect("/listing");
};