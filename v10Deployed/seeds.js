var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "data:image/jpeg;base64,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",
        description: "Beatiful place, best place to camp!"
    },
    {
        name: "Desert Nesa",
        image: "https://www.campsitephotos.com/photo/camp/107766/feature_Big_Pine_Flat-f2.jpg",
        description: "Beatiful place, best place to camp!"
    },
    {
        name: "Canyon Floor",
        image: "https://www.campsitephotos.com/photo/camp/4850/feature_BlackRockCanyon-f3.jpg",
        description: "Beatiful place, best place to camp!"
    }
];

function seedDB() {
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("remove campgrounds");
        Comment.remove({}, function(err){
            if(err) {
                console.log(err);
            }
            console.log("remove comment");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                        if(err){
                            console.log(err);
                        }
                        else {
                            console.log("Added campground");
                            Comment.create(
                                {
                                  text: "This place is great, but I wish there is internet",
                                  author: "Homer"
                                }, function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment._id);
                                        campground.save();
                                        console.log("Created new comment");
                                    }
                                });
                        }
                });
            });
        });
    });
}

module.exports = seedDB;