const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const requireLogin = require('../middleware/requireLogin');

router.post("/createpost", requireLogin, function (req, res) {
    const {
        title,
        body,
        urlPic
    } = req.body;

    if (!title || !body || !urlPic) {
        res.status(422).json({
            error: "Please enter all fields"
        });
    }

    req.user.password = undefined;

    const newPost = new Post({
        title,
        body,
        photo: urlPic,
        postedBy: req.user
    });

    newPost.save(function (err, result) {
        if (err) {
            console.log(err);
        } else if (result) {
            res.json({
                post: result
            });
        }
    })
});

router.get("/getsubpost", requireLogin, function (req, res) {
    Post.find({postedBy:{$in:req.user.following}}, function (err, posts) {
            if (err) {
                console.log(err);
            } else if (posts) {
                res.json({
                    posts
                });
            }
        }).populate("postedBy", "_id username")
        .populate("comments.postedBy", "_id username")
        .sort("-createdAt")
});

router.get("/allpost", requireLogin, function (req, res) {
    Post.find({}, function (err, posts) {
            if (err) {
                console.log(err);
            } else if (posts) {
                res.json({
                    posts
                });
            }
        }).populate("postedBy", "_id username")
        .populate("comments.postedBy", "_id username")
        .sort("-createdAt")
});

router.get("/mypost", requireLogin, function (req, res) {

    Post.find({
        postedBy: req.user._id
    }, function (err, posts) {
        if (err) {
            console.log(err);
        } else if (posts) {
            res.json({
                posts
            });
        }
    }).populate("postedBy", "_id username");
});

router.put('/like', requireLogin, function (req, res) {
    Post.findByIdAndUpdate(req.body.postID, {
        $push: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, function (req, res) {
    Post.findByIdAndUpdate(req.body.postID, {
        $pull: {
            likes: req.user._id
        }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({
                error: err
            })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, function (req, res) {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postID, {
            $push: {
                comments: comment
            }
        }, {
            new: true
        })
        .populate("comments.postedBy", "_id username")
        .populate("postedBy", "_id username")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({
                    error: err
                })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', requireLogin, function (req, res) {
 
    Post.findOne({
            _id: req.params.postId
        })
        .populate("postedBy", "_id")
        .exec((err, post) => {
     
            if (err || !post) {
                return res.status(422).json({
                    error: err
                })
            }
         
             if (post.postedBy._id.toString() === req.user._id.toString()) {
               // console.log("Here");
                post.remove()
                .then(result => {
                       // console.log("delete");
                        res.json(result)
                    })
                    .catch(err => {
                        console.log(err);
                    })
             }
        })
})


module.exports = router;