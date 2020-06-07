const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, "Please provide your login"]
    },
    password: {
        type: String,
        required: [true, "Please provide your password"]
    }
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema); // Get from db or create