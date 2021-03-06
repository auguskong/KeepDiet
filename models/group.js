var mongoose = require("mongoose");

var groupSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member"
        }
    ],
    target: String,
    start: String,
    end: String,
    max: String
});

module.exports = mongoose.model("Group", groupSchema);