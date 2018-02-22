var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req,res) {
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds}); 
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampground= {name:name, image:image, description:description, author:author};
    //Create a new campground and save to DB
    Campground.create(newcampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW - form that add new campground
router.get("/new", middleware.isLoggedIn, function (req,res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err) {
            console.log(err);
        } else {
            console.log("show camp--------: "+foundcampground);
            res.render("campgrounds/show", {campground: foundcampground});
        }
    });
});

//Edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundcampground){
        if(!err) {
            res.render("campgrounds/edit", {campground: foundcampground});
        } 
    });
});

//Update
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});

// Remove campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});


module.exports = router;