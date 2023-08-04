const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');

router.get('/user/:id', requireLogin, function (req, res) {

    User.findOne({
        _id: req.params.id
    }, function (err, user) {
        if (err) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        if (user) {
            Post.find({
                    postedBy: req.params.id
                })
                .populate("postedBy", "_id username")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(404).json({
                            error: err
                        })
                    }
                    res.json({
                        user,
                        posts
                    })
                })
        }
    }).select("-password")

})

router.put('/follow', requireLogin, function (req, res) {

    User.findByIdAndUpdate(req.body.followId, {
        $push: {
            followers: req.user._id
        }
    }, {
        new: true
    }, function (err, result) {

        if (err) {
            return res.status(422).json({
                error: err
            })
        }

        User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: req.body.followId
            }
        }, {
            new: true
        }, function (err, result) {

            if (err) {
                return res.status(422).json({
                    error: err
                })
            }

            if (result) {
                res.json(result)
            }
        }).select("-password")
    })
})

router.put('/unfollow', requireLogin, function (req, res) {

    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {
            followers: req.user._id
        }
    }, {
        new: true
    }, function (err, result) {

        if (err) {
            return res.status(422).json({
                error: err
            })
        }

        User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: req.body.unfollowId
            }
        }, {
            new: true
        }, function (err, result) {

            if (err) {
                return res.status(422).json({
                    error: err
                })
            }

            if (result) {
                res.json(result)
            }
        })
    }).select("-password")
})


module.exports = router;