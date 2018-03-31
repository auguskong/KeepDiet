var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    
//middleware for passing the currentUser 
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

router.get("/", function(req, res){
    res.render("Landing/landing");
});

//===========
//AUTH ROUTES
//===========



// show register form 
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/groups");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/groups",
        failureRedirect: "/login"
    }), function(req, res){
});

//logic route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/groups");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //advance to the next()
    }
    res.redirect("/login");
}

module.exports = router;