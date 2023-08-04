const jwt = require('JsonWebToken')
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = function (req, res, next) {

    const {
        authorization
    } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "you must logged in"
        });
    } else {
        const token = authorization.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
            if (err) {
                return res.status(401).json({
                    error: "you must logged in"
                });
            } else {

                const {
                    _id
                } = payload;

                User.findOne({
                    _id
                }, function (err, savedUser) {
                    if (err) {
                        console.log(err);
                    } else if (savedUser) { // user is found
                        req.user = savedUser;
                        next();
                    }
                });

            }

        })
    }
}