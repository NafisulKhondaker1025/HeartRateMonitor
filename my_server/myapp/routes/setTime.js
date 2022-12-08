const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const User = require('../models/User');

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};
const msg = {"Success" : "Times set successfully"}

// txData = {
//     timeStart: time_start,
//     timeEnd: time_end,
//     timeInterval: time_interval
// }


router.post("/", async function(req, res) {
    if (!req.headers["x-auth"]) {
        res.status(400).send(errorMsg)
    }
    else {
        if (!req.body.userID) {
            try {
                const decoded = jwt.decode(req.headers["x-auth"], secret)
                User.updateOne({username: decoded.username}, {
                    startTime : req.body.timeStart, 
                    endTime : req.body.timeEnd,
                    timeInterval : req.body.timeInterval
                }, function(err, result) {
                    if (err) {
                        res.status(400).send(errorMsg1)
                    }
                    else if (result.n === 0) {
                        res.status(404).send(errorMsg1);
                    } 
                    else {
                        res.status(200).send(msg);
                    }
                })
            }
            catch {
                res.status(400).send(errorMsg)
            }
        }
        else {
            try {
                const decoded = jwt.decode(req.headers["x-auth"], secret)
                User.updateOne({_id: req.body.userID}, {
                    startTime : req.body.timeStart, 
                    endTime : req.body.timeEnd,
                    timeInterval : req.body.timeInterval
                }, function(err, result) {
                    if (err) {
                        res.status(400).send(errorMsg1)
                    }
                    else if (result.n === 0) {
                        res.status(404).send(errorMsg1);
                    } 
                    else {
                        res.status(200).send(msg);
                    }
                })
            }
            catch {
                res.status(400).send(errorMsg)
            }
        }
    }
})

module.exports = router;