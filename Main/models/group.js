var mongoose = require("mongoose");

//SCHEMA SETUP
var groupSchema = new mongoose.Schema({
    name: String,
    target: String,
    start: String,
    end: String,
    max: String
});

module.exports = mongoose.model("Group", groupSchema);