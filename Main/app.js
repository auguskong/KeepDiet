var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    //User            = require("./models/user"),
    moment          = require("moment");

mongoose.connect("mongodb://localhost/keep_diet");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var groupSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Group = mongoose.model("Group", groupSchema);

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

app.get("/groups", function(req, res){
    //GET all groups from DB
    Group.find({}, function(err, groups){
        if(err){
            console.log(err);
        } else {
            res.render("Groups/groups", {groups: groups})
        }
    })
});

app.post("/groups", function(req, res){
    // get data from form and add to groups array
    var name = req.body.name;
    var image = req.body.image;
    var newGroup = {name: name, image: image}
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

app.get("/diary/new", function(req, res){
    res.render("Diary/newDiary.ejs");
});

app.get("/groups/desc", function(req, res){
    res.render("Groups/groupDescription.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});
