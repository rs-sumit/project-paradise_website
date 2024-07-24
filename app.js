if(process.env.NODE_ENV !="production"){    
  require("dotenv").config(); 
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const path = require("path");
const listingroute=require("./route/listingroute.js");
const reviewroute=require("./route/reviewroute.js");
const userroute=require("./route/userroute.js");
const session=require("express-session");
const mongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User = require("./models/user.js");

app.engine('ejs',ejsmate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

let mongodbUrl=process.env.MONGODB_URL;

async function main(){
    await mongoose.connect(mongodbUrl);
}

main().then(()=>{console.log("connection is successful");}).catch((err)=>{console.log(err);});


app.listen(3000,()=>{
    console.log("server is listening at 3000");
});

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const store=mongoStore.create({
  mongoUrl:mongodbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  },
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser=req.user;
    next();
})




//signin & signup
app.use("/",userroute);

//listing
app.use("/listing", listingroute);

//review
app.use("/listing/:_id/review", reviewroute);

//home page
app.get("/",(req,res)=>{
  console.log("This is home page.");
  res.redirect("/listing");
})

//terms and conditions
app.get("/terms",(req,res)=>{
    res.render("listing/terms");
});


//error handling
app.all("*",(req,res,next)=>{
    next(new expressError(400,"page not found!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    res.status(status).render("error",{message});
    // res.status(status).send(message);
})