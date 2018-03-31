var express = require("express"),
    router  = express.Router(),
    Diary   = require("../models/diary");


router.get("/reward", isLoggedIn, function(req, res){
    res.render("Reward/reward.ejs");
});

// show all diaries
router.get("/reward/reportprogress", function(req, res){
    // get all diaries from db
    Diary.find({}, function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportprogress.ejs", {diaries: diaries, currentUser: req.user});
        }
    })
});

router.post("/reward/reportprogress/new", function(req, res) {
   // get data from form and add to diary array
   var date = req.body.date;
   var checkin = req.body.checkin;
   var checkout = req.body.checkout;
   var breakfast = req.body.breakfast;
   var lunch = req.body.lunch;
   var dinner = req.body.dinner;
   var snack = req.body.snack;
   var exercise = req.body.exercise;
   var newDiary = {date: date, checkin: checkin, checkout: checkout, breakfast: breakfast, lunch: lunch, dinner: dinner, snack: snack, exercise: exercise};
   
   // create a new diary and save to db
   Diary.create(newDiary, function(err, newlyCreated) {
       if(err){
           console.log(err);
       } else {
           res.redirect("/reward/reportprogress");
       }
   });
   
});


router.get("/reward/reportprogress/new", function(req, res){
    res.render("Reward/reportNew.ejs");
});

router.put("/reward/reportprogress/edit", function(req, res) {
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

router.get("/reward/reportprogress/edit/:id", function(req, res){
    // get all diaries from db
    Diary.findById(req.params.id).exec(function(err, diaries) {
        if(err) {
            console.log(err);
        } else {
            res.render("Reward/reportEdit.ejs", {diary: diaries});
        }
    });  
});

router.get("/reward/groupprogress", function(req, res){
    res.render("Reward/groupprogress.ejs");
});

router.get("/reward/deposit", function(req, res){
    res.render("Reward/deposit.ejs");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //advance to the next()
    }
    res.redirect("/login");
}

module.exports = router;