var mongoose = require("mongoose");

//SCHEMA SETUP
var groupSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Group", groupSchema);