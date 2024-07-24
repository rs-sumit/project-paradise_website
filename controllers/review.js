const listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const review = require("../models/review.js");
const reviewSchema = require("../schema/reviewSchema.js");

module.exports.reviewposting = async (req, res) => {
  let { _id } = req.params;
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new expressError(400, result.error);
  }
  let Listing = await listing.findById(_id);
  let newReview = new review(req.body.review);
  newReview.auther = req.user._id;
  Listing.reviews.push(newReview);
  await newReview.save();
  await Listing.save();
  req.flash("success", "New review is added!");
  res.redirect(`/listing/${_id}`);
};

module.exports.reviewdestroying = async (req, res) => {
  let { _id, reviewId } = req.params;
  let delid = await listing.findByIdAndUpdate(_id, {
    $pull: { reviews: reviewId },
  });
  await review.deleteOne({ _id: reviewId });
  req.flash("success", "The review is Deleted successfully!");
  res.redirect(`/listing/${_id}`);
};