var mongoose = require("mongoose");

//SCHEMA SETUP
var diarySchema = new mongoose.Schema({
    date: String,
    checkin: String,
    checkout: String,
    breakfast: String,
    lunch: String,
    dinner: String,
    snack: String,
    exercise: String 
});

module.exports = mongoose.model("Diary", diarySchema);