const User = require("../models/user.js");

module.exports.signinform = (req, res) => {
  res.render("./users/signin");
};

module.exports.signindata = async (req, res) => {
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.signupform = (req, res) => {
  res.render("./users/signup");
};

module.exports.signupdata = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let newregister = await User.register(newUser, password);
    req.login(newregister, (err) => {
      if (err) {
        next(err);
      }
      res.redirect("/listing");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You have successfully logged Out.");
    res.redirect("/listing");
  });
};