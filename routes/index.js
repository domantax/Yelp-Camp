var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//landing page route
router.get("/", function(req, res) {
    res.render("landing");
});


//Auth routes
// show register form route
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});
//handle sign up logic route
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if (req.body.adminCode === "verysecretproject") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form route
router.get("/login", function(req, res){
   res.render("login", {page: "login"}); 
});
// handling login logic route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});


module.exports = router;
//=======================