const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();

///////////////////////////////////////////////////

const app = express();
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

///////////////////////////////////////////////////

//connect to DB
mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//check status
var db = mongoose.connection;
db.on("connected", function () {
    console.log("Successfully connected to DB");
});
db.on("error", console.error.bind(console, "MongoDB Connection error"));
///////////////////////////////////////////////////

//routers
require('./models/user');
require('./models/post');

app.use( require("./routes/auth"));
app.use( require("./routes/post"));
app.use( require("./routes/user"));

///////////////////////////////////////////////////
//listen to port

app.listen(process.env.PORT, function () {
    console.log('Server is running on port ', process.env.PORT);
});