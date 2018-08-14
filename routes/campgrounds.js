var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Campground = require('../models/campground');


// index route 
router.get("/", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, page: "campgrounds"});
        }
    });
    
});
//Camground new route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//Campground SHOW route
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err || !campground) {
            req.flash("error", "Campground not found!");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: campground});
        }
    });
});
//Campground create route 
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var newCamp = {name: name, image:image, description: description, author: author, price: price};
    Campground.create(newCamp, function(err, newlyCamp) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "New campground created!");
            res.redirect("/campgrounds");
            console.log("new camp created:");
            console.log(newlyCamp);
        }
    });
    
});

//EDIT route
router.get("/:id/edit", middleware.campgroundAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
    
});

//UPDATE route

router.put("/:id", middleware.campgroundAuthorization, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground edited!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/:id", middleware.campgroundAuthorization, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            req.flash("success", "Campground deleted!");
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;