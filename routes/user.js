const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const userController = require ("../controller/users.js");
const user = require("../models/user.js");



router.get("/signup",wrapAsync(userController.signupForm));
router.post("/signup",wrapAsync(userController.signup));

router.get("/login", wrapAsync(userController.loginForm));

router.post("/login",saveRedirectURL,passport.authenticate("local", {failureRedirect : "/login" ,failureFlash: true}),wrapAsync(userController.login));

router.get("/logout", wrapAsync(userController.logout));


module.exports= router;