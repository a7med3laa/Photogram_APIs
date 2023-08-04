const mongoose = require('mongoose');
const {
    ObjectId
} = mongoose.Schema.Types;

///////////////////////////////////////////////////
//define schema for user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://res.cloudinary.com/a7med/image/upload/v1616671315/profile_k07jcf.jpg"
    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("User", userSchema);