var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    Campground = require('./models/campground'),
    // SeedDB = require('./seed'),
    Comment = require('./models/comment'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user');
    
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"    
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// SeedDB(); //seed Data base
app.use(flash());

app.locals.moment = require('moment');
//Passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Yelp camp server started');
});