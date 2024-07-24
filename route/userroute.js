const express=require("express");
const router=express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewere.js");
const controllerUsers=require("../controllers/users.js");


router
  .route("/signin")
  .get(controllerUsers.signinform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    asyncWrap(controllerUsers.signindata)
  );


router
  .route("/signup")
  .get(controllerUsers.signupform)
  .post(asyncWrap(controllerUsers.signupdata));


router.route("/logout")
.get(controllerUsers.logout);


module.exports=router;
