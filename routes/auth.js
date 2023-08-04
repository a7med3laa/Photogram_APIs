const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const requireLogin= require('../middleware/requireLogin');

router.get("/protected", requireLogin,function (req, res) {
    res.send('Hello user');
});

router.get("/",function(req,res){
    res.send("Social API")
})

router.post("/signup", function (req, res) {

    const {
        username,
        email,
        password,
        pic
    } = req.body;

    if (!username || !email || !password) {
        return res.status(422).json({
            error: "Please add all fields"
        });
    }

    //search if user already existed
    User.findOne({
        email: email
    }, function (err, savedUser) {
        if (err) {
            console.log(err);
        } else if (savedUser) {
            return res.status(422).json({
                error: "User Already Existed"
            });
        } else {
            bcryptjs.hash(password, 12).then(hashedpassword => {
                const newUser = new User({
                    username,
                    email,
                    password: hashedpassword,
                    pic
                });

                newUser.save(function (err) {

                    if (err) {
                        res.json({error : "Register Error" + err});
                    } else {
                        res.json({message:"Register Success"});
                    }
                });

            });

        }
    });

});

router.post("/signin", function (req, res) {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {
        return res.status(422).json({
            error: "Please add all fields"
        });
    }

    //search if user already existed
    User.findOne({
        email: email
    }, function (err, savedUser) {
        if (err) {
            console.log(err);
        } else if (!savedUser) {
            return res.json({
                error: "Invalid Email or password"
            });
        } else {
            bcryptjs.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({
                        //     message: "Successfully loged in"
                        // });
                        const token = jwt.sign({
                            _id: savedUser._id
                        }, process.env.JWT_SECRET);
                        const {_id, username, email,followers,following,pic} = savedUser;
                        res.json({
                            token , user : {_id, username, email,followers,following,pic}
                        });
                    } else {
                        return res.json({
                            error: "Invalid Email or password"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });
});
module.exports = router;