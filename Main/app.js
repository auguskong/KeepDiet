var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var moment = require("moment");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var groups = [
        {name: "Running Groups", image: "http://watchfit.com/wp-content/uploads/2015/10/24489910_l-1024x682.jpg"},
        {name: "Camping Groups", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Hiking Groups", image: "https://static1.squarespace.com/static/53bed66ee4b0fc5deee88551/t/56b7c428555986e5db03075a/1454883907809/trail-hiking-mountain-group"},
        {name: "Cycling Groups", image: "http://www.lsu.edu/highlights/2010/07/images/CyclingClub2.jpg"},
        {name: "Swimming Groups", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8tTH5bJQYWSqgoClrXIH-8QRuBbswnOH4lycbLbMmaynoHZY3GA"},
        {name: "Boxing Groups", image: "http://harlemboxing.nyc/wp-content/uploads/2014/07/Group_sm1.jpeg"},
        {name: "Basketball Groups", image: "http://www.loganleisurecentres.com.au/__data/assets/image/0011/439967/Jazz-Team-Training-8-16-Cornubia-Park.jpg"}
];
    
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
    res.render("Groups/groups",{groups:groups});
});

app.post("/groups", function(req, res){
    // get data from form and add to groups array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
    groups.push(newCampground);
    //redirect back to groups page
    res.redirect("/groups");
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
   console.log("The YelpCamp Server Has Started!");
});
