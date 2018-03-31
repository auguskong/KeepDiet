var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Group           = require("./models/group"),
    User            = require("./models/user"),
    Diary           = require("./models/diary")
    moment          = require("moment");

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

// var groups = [
//         {name: "Hiking Groups", image: "https://static1.squarespace.com/static/53bed66ee4b0fc5deee88551/t/56b7c428555986e5db03075a/1454883907809/trail-hiking-mountain-group"},
//         {name: "Cycling Groups", image: "http://www.lsu.edu/highlights/2010/07/images/CyclingClub2.jpg"},
//         {name: "Swimming Groups", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8tTH5bJQYWSqgoClrXIH-8QRuBbswnOH4lycbLbMmaynoHZY3GA"},
//         {name: "Boxing Groups", image: "http://harlemboxing.nyc/wp-content/uploads/2014/07/Group_sm1.jpeg"},
//         {name: "Basketball Groups", image: "http://www.loganleisurecentres.com.au/__data/assets/image/0011/439967/Jazz-Team-Training-8-16-Cornubia-Park.jpg"}
// ];
    
app.get("/", function(req, res){
    res.render("Landing/landing");
});

app.get("/diary", function(req, res){ 
    res.render("Diary/diary"); 
});

exports.index= function(req, res) {
    res.render("Diary/diary", {moment: moment});
}

//INDEX - show all groups
app.get("/groups", function(req, res){
    //GET all groups from DB
    Group.find({}, function(err, groups){
        if(err){
            console.log(err);
        } else {
            res.render("Groups/groups", {groups: groups, currentUser: req.user});
        }
    })
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to groups array
    var name = req.body.name;
    var target = req.body.target;
    var start = req.body.start;
    var end = req.body.end;
    var max = req.body.max;
    
    var newGroup = {name: name, target: target, start: start, end: end, max: max}
    //Create a new group and save to DB
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

app.get("/groups/desc", function(req, res){
    res.render("Groups/groupDescription.ejs");
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
    if(req.isAuthnticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/reward", function(req, res){
    res.render("Reward/reward.ejs");
});

// //INDEX - show all groups
// app.get("/groups", function(req, res){
//     //GET all groups from DB
//     Group.find({}, function(err, groups){
//         if(err){
//             console.log(err);
//         } else {
//             res.render("Groups/groups", {groups: groups, currentUser: req.user});
//         }
//     })
// });

// app.post("/groups", function(req, res){
//     // get data from form and add to groups array
//     var name = req.body.name;
//     var image = req.body.image;
//     var newGroup = {name: name, image: image}
//     //Create a new group and save to DB
//     Group.create(newGroup, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/groups");
//         }
//     });
// });

// show all diaries
app.get("/reportprogress", function(req, res){
    // get all diaries from db
    Diary.find({}, function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportprogress.ejs", {diaries: diaries, currentUser: req.user});
        }
    })
});

app.post("/reportprogress/new", function(req, res) {
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
           res.redirect("/reportprogress");
       }
   });
   
});

app.get("/reportprogress/new", function(req, res){
    res.render("Reward/reportNew.ejs");
});

app.put("/reportprogress/edit", function(req, res) {
   var date = req.body.date;
   var checkin = req.body.checkin;
   var checkout = req.body.checkout;
   var breakfast = req.body.breakfast;
   var lunch = req.body.lunch;
   var dinner = req.body.dinner;
   var snack = req.body.snack;
   var exercise = req.body.exercise;
   var updateDiary = {date: date, checkin: checkin, checkout: checkout, breakfast: breakfast, lunch: lunch, dinner: dinner, snack: snack, exercise: exercise}
   
});

app.get("/reportprogress/edit", function(req, res){
    // get all diaries from db
    Diary.find({}, function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportEdit.ejs", {diaries: diaries, currentUser: req.user});
        }
    })  
});

app.get("/groupprogress", function(req, res){
    res.render("Reward/groupprogress.ejs");
});

app.get("/deposit", function(req, res){
    res.render("Reward/deposit.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
