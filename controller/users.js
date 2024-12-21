const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const User = require('../models/user.js');
module.exports.signupForm =(req,res)=>{
res.render("users/signup.ejs");
}
module.exports.signup =async(req,res)=>{
    try{
        let {username , email , password}=req.body;
    let newUser = new User({email,username});
    let result = await User.register(newUser,password);
    console.log(result);
    req.login(result, (err)=>{
        if(err){return next(err);}
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
    });
    
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

  
}

module.exports.loginForm =(req,res)=>{
    res.render("users/login.ejs");
    }

module.exports.login = async(req,res)=>{
   
        req.flash("success","welcome to wanderlust");
        let redirectURL = res.locals.redirectURL||"/listings"  ;
        res.redirect( redirectURL );
    
    }
module.exports.logout =(req,res, next)=>{
    req.logout((err)=>{
        if(err){return next(err);}
        
    req.flash("success", "you are logged out now");
    res.redirect("/listings");
    })

}