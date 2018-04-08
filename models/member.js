var mongoose = require("mongoose");

var memberSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    deposit: String,
    personaltarget: String,
    startdate: String,
    enddate: String,
    deposit: String
});

module.exports = mongoose.model("Member", memberSchema);