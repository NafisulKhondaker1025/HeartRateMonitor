const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const User = require('../models/User');

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};
const msg = {"Success" : "Physician has been added to you"}

router.post("/", async function(req, res) {
    try {
        if (!req.headers["x-auth"]) {
            res.status(400).send(errorMsg)
        }
        else {
            if (req.body.objID) {
                const decoded = jwt.decode(req.headers["x-auth"], secret)
                User.updateOne({username: decoded.username}, {physician : req.body.objID}, function(err, result) {
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
    }   
    catch (ex) {
        res.status(400).send(errorMsg)
    }
})

module.exports = router;