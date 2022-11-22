const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const Physician = require('../models/Physician');
const User = require('../models/User');

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};
const msg = {"Success" : "Fields Updated"}


router.post("/", async function(req, res) {
    if (!req.headers["x-auth"]) {
        res.status(400).send(errorMsg)
    }
    else {
        const decoded = jwt.decode(req.headers["x-auth"], secret)
        const profileInfo = JSON.parse(req.body.profileFields)
        if (req.body.type == "user") {
            User.updateOne({username: decoded.username}, {profileFields: profileInfo}, function(err, result) {
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
        else if (req.body.type == "physician") {
            Physician.updateOne({username: decoded.username}, {profileFields: profileInfo}, function(err, result) {
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
        else {
            res.status(400).send(errorMsg1)
        }
    }
})

module.exports = router;