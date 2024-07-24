const listing = require("./models/listing.js");
const review = require("./models/review.js");

module.exports.isSignedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You have to Sign In first");
    return res.redirect("/signin");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isAccess = async (req, res, next) => {
  let { _id } = req.params;
  let id = await listing.findById(_id);
  if (!req.user._id.equals(id.owner._id)) {
    req.flash("error", "You have not the access to edit this Listing!");
    return res.redirect(`/listing/${_id}/show`);
  }
  next();
};

module.exports.isReviewAuther = async (req, res, next) => {
  let { _id,reviewId } = req.params;
  let Review = await review.findById(reviewId);
  if (!req.user._id.equals(Review.auther._id)) {
    req.flash("error", "You are not the Auther of this Review!");
    return res.redirect(`/listing/${_id}/show`);
  }
  next();
};

