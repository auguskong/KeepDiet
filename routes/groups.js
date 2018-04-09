var express = require("express"),
    router  = express.Router(),
    Group   = require("../models/group"),
    Member  = require("../models/member");

//INDEX - show all groups
router.get("/groups", isLoggedIn, function(req, res){
    //is user logged in?
    Group.find().where('author.id').equals(req.user.id).exec(function(err, groups){
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
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGroup = {name: name, author: author, image: image, target: target, start: start, end: end, max: max}
    Group.create(newGroup, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/groups");
        }
    });
});

//Add a new member to the group


//EDIT GROUP ROUTE
router.get("/groups/:id/edit", checkGroupOwnership, function(req, res){
    Group.findById(req.params.id, function(err, foundGroup){
        if (err) {
            console.log(err);
        } else {
            res.render("Groups/edit", {group: foundGroup});
        }
    });
});

//UPDATE GROUP ROUTE
router.put("/groups/:id", checkGroupOwnership, function(req, res){
    //find and update the correct group
    Group.findByIdAndUpdate(req.params.id, req.body.group, function(err, updatedGroup){
        if(err) {
            res.redirect("/groups");
        } else {
            res.redirect("/groups/" + req.params.id);
        }
    })
});

//DESTROY GROUP ROUTE
router.delete("/groups/:id", checkGroupOwnership, function(req, res){
    Group.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/groups");
        } else {
            res.redirect("/groups/");
        }
    });
});


router.get("/groups/new", function(req, res){
   res.render("Groups/new"); 
});

//Show more info about one group
router.get("/groups/:id", function(req, res){
    //find the group with provided ID
    Group.findById(req.params.id).populate("members").exec(function(err, foundGroup){
        if(err){
            console.log(err);
        } else {
            console.log(foundGroup);
            res.render("Groups/show", {group: foundGroup});
        }
    });
});

// =================
// Member Routes
// =================

router.get("/groups/:id/members/new", function(req, res){
    //find group by id
    Group.findById(req.params.id, function(err, group){
        if(err){
            console.log(err);
        } else {
            res.render("Members/new", {group: group});
        }
    })
})

router.post("/groups/:id/members", function(req, res){
    //lookup group using ID
    Group.findById(req.params.id, function(err, group){
        if(err){
            console.log(err);
            res.redirect("/groups");
        } else {
            Member.create(req.body.member, function(err, member){
                if(err){
                    console.log(err);
                } else {
                    group.members.push(member);
                    group.save();
                    res.redirect("/groups/" + group._id);
                }
            })
        }
    });
    //create the new member
    //connect the member to group
    //redirect group show page
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //advance to the next()
    }
    res.redirect("/login");
}

function checkGroupOwnership(req, res, next) {
    if(req.isAuthenticated()) {
        Group.findById(req.params.id, function(err, foundGroup){
            if(err) {
                res.redirect("back");
            } else {
                if (foundGroup.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;