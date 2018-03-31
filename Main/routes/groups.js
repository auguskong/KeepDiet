var express = require("express"),
    router  = express.Router(),
    Group   = require("../models/group");

//INDEX - show all groups
router.get("/groups", isLoggedIn, function(req, res){
    //GET all groups from DB
    Group.find({}, function(err, groups){
        if(err){
            console.log(err);
        } else {
            res.render("Groups/groups", {groups: groups, currentUser: req.user});
        }
    });
});

//Add a new group
router.post("/groups", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var target = req.body.target;
    var start = req.body.start;
    var end = req.body.end;
    var max = req.body.max;
    var newGroup = {name: name, image: image, target: target, start: start, end: end, max: max}
    Group.create(newGroup, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/groups");
        }
    });
});

router.get("/groups/new", function(req, res){
   res.render("Groups/new.ejs"); 
});

//Show more info about one group
router.get("/groups/:id", function(req, res){
    //find the group with provided ID
    Group.findById(req.params.id).exec(function(err, foundGroup){
        if(err){
            console.log(err);
        } else {
            console.log(foundGroup);
            res.render("Groups/show", {group: foundGroup});
        }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //advance to the next()
    }
    res.redirect("/login");
}


module.exports = router;