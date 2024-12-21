if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./schema.js");
const Review = require('./models/review.js');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport =require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');
const {isLoggedIn ,isOwner, validateListing} = require("./middleware.js");
const dburl = process.env.ATLASDB_URL;

app.listen(8080,()=>{
  console.log('Server started');
});


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")))
app.engine('ejs', ejsMate);

const store = MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60,

});
store.on("error",()=>{
  console.log("mongo session store error" , err);
})

const sessionOptions ={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
  maxAge:7*24*60*60*1000,
  httpOnly: true,

  }

}
// app.get('/',(req,res)=>{
//   res.send("root");
// });


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(flash());
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentuser = req.user;
  next();

  
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);





main().then(()=>{console.log("successful")}).catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dburl);

} 



 


// const validateListing = (req,res,next)=>{
// const {error} = listingSchema.validate(req.body);
  
//   if(error){
//     let errMsg =error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400 ,errMsg);
//   }else{next()}

// }
// const validateReview = (req,res,next)=>{
//   const {error} = reviewSchema.validate(req.body);
    
//     if(error){
//       let errMsg =error.details.map((el)=> el.message).join(",");
//       throw new ExpressError(400 ,errMsg);
//     }else{next()}
  
//   }


      
      

  

//index route
// app.get('/listings', wrapAsync (async (req,res)=>{
// const listings = await Listing.find({});
//   res.render('listings/index.ejs',{listings});
  
// }));

// //new route
// app.get("/listings/new" ,(req, res)=> {
// res.render("listings/new.ejs");
// });

// //show route
// app.get('/listings/:id', wrapAsync (async (req,res)=>{
//   const {id} = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/viewlisting.ejs",{listing});
// }));

// //create route
// app.post("/listings",validateListing, wrapAsync (async (req,res , next)=>{
  
//    const newlisting = new Listing(req.body.listing);
//   await newlisting.save();
//   res.redirect(`/listings`);
 
  
// }));

// //edit route
// app.get("/listings/:id/edit" , wrapAsync (async (req,res)=> {
//   let {id} = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs",{listing});
// }));

// //update route
// app.put("/listings/:id",validateListing,  wrapAsync (async (req,res)=>{
  
//   const id = req.params.id;
//   const newlisting = await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   console.log(newlisting);
//   res.redirect(`/listings/${id}`);

// }));

// //destroy route
// app.delete("/listings/:id", wrapAsync (async (req , res )=>{
//   const {id} = req.params;
//   await Listing.findByIdAndDelete(id);
//  res.redirect(`/listings`);




// }));

// //review route
// app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req , res)=>{
// let listing = await Listing.findById(req.params.id);
// let newReview = new Review(req.body.review);
// listing.reviews.push(newReview);
// await newReview.save();
// await listing.save();
// res.send("new review saved");



// }));

// //delete review route
// app.delete("/listings/:id/reviews/:reviewId",async (req, res )=>{
//   let {id , reviewId}= req.params ;
//   await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
//   await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/listings/${id}`);
// });



// app.get("/demouser" , async(req,res)=>{
//   let fakeUser = new User({
//     email:"abc@gmail.com",
//     username:"abc",

//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// })



app.all("*",(req,res,next)=>{
 next(new ExpressError(401,"Page not found"));
});



app.use((err, req , res ,next)=>{
  let {statuscode , message} = err;
  // res.status(statuscode=500).send(message="something went wrong");
  res.status(statuscode).render("error.ejs", {err});
});



