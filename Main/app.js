var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Group           = require("./models/group"),
    User            = require("./models/user"),
    Diary           = require("./models/diary"),
    $               = require('jquery'),
    moment          = require("moment"),
    ObjectID        = require('mongodb').ObjectID;

mongoose.connect("mongodb://localhost/keep_diet_2");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION
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

//middleware for passing the currentUser 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/", function(req, res){
    res.render("Landing/landing");
});

//INDEX - show all groups
app.get("/groups", isLoggedIn, function(req, res){
    //GET all groups from DB
    Group.find({}, function(err, groups){
        if(err){
            console.log(err);
        } else {
            res.render("Groups/groups", {groups: groups, currentUser: req.user});
        }
    })
});

app.post("/groups", isLoggedIn, function(req, res){
    
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

app.get("/groups/new", function(req, res){
   res.render("Groups/new.ejs"); 
});

//Show more info about one group
app.get("/groups/:id", function(req, res){
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

//===========
//AUTH ROUTES
//===========

// show register form 
app.get("/register", function(req, res){
    res.render("register")
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/groups")
        })
    })
})

//show login form
app.get("/login", function(req, res){
    res.render("login");
})

//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/groups",
        failureRedirect: "/login"
    }), function(req, res){
});

//logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/groups");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //advance to the next()
    }
    res.redirect("/login");
}

app.get("/reward", isLoggedIn, function(req, res){
    res.render("Reward/reward.ejs");
});

// show all diaries
app.get("/reward/reportprogress", function(req, res){
    // get all diaries from db
    Diary.find({}, function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportprogress.ejs", {diaries: diaries, currentUser: req.user});
        }
    })
});

app.post("/reward/reportprogress/new", function(req, res) {
   // get data from form and add to diary array
   var date = req.body.date;
   var checkin = req.body.checkin;
   var checkout = req.body.checkout;
   var breakfast = req.body.breakfast;
   var lunch = req.body.lunch;
   var dinner = req.body.dinner;
   var snack = req.body.snack;
   var exercise = req.body.exercise;
   var newDiary = {date: date, checkin: checkin, checkout: checkout, breakfast: breakfast, lunch: lunch, dinner: dinner, snack: snack, exercise: exercise}
   
   // create a new diary and save to db
   Diary.create(newDiary, function(err, newlyCreated) {
       if(err){
           console.log(err);
       } else {
           res.redirect("/reward/reportprogress");
       }
   });
   
});

app.get("/reward/reportprogress/new", function(req, res){
    res.render("Reward/reportNew.ejs");
});

app.post("/reward/reportprogress/update/:id", function(req, res) {
   Diary.update({"_id": ObjectID(req.params.id)}, {$set:{"date": req.body.date, "checkin" : req.body.checkin, "checkout": req.body.checkout, "breakfast": req.body.breakfast, "lunch": req.body.lunch, "dinner": req.body.dinner, "snack": req.body.snack, "exercise": req.body.exercise}}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/reward/reportprogress");
        }
   });
});

app.get("/reward/reportprogress/edit/:id", function(req, res){
    // get all diaries from db
    Diary.findById(req.params.id).exec(function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportEdit.ejs", {diary: diaries});
        }
    });  
});

app.get("/groupprogress", function(req, res){
    res.render("Reward/groupprogress.ejs");
});

app.get("/reward/deposit", function(req, res){
    res.render("Reward/deposit.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
