var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//Comments NEW route 
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments CREATE route 
router.post('/', middleware.isLoggedIn, function(req, res) {
    //
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            //create and add comment to db
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to show page
                    req.flash("success", "New comment posted!");
                    res.redirect('/campgrounds/' + req.params.id);
                }
            });
        }
    });
});

//Comments edit route 
router.get("/:comment_id/edit", middleware.commentAuthorization, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                req.flash("success", "New campground created!");
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Comments update route
router.put("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//comments delete route
router.delete("/:comment_id", middleware.commentAuthorization, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
//=======================