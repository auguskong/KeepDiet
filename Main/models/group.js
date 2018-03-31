var mongoose = require("mongoose");

// //SCHEMA SETUP
// var groupSchema = new mongoose.Schema({
//     name: String,
//     target: String,
//     start: String,
//     end: String,
//     max: String
// });

var groupSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Group", groupSchema);