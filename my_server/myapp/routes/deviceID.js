const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
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
        const device_ID = req.body.deviceID
        const api_Key = jwt.encode({deviceID: device_ID}, secret)
        User.updateOne({username: decoded.username}, {deviceID : device_ID, apiKey: api_Key}, function(err, result) {
            if (err) {
                res.status(400).send(errorMsg1)
            }
            else if (result.n === 0) {
                res.status(404).send(errorMsg1);
            } 
            else {
                res.status(200).send({apiKey : api_Key});
            }
        })
    }
})

module.exports = router;