const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const Physician = require('../models/Physician');
const User = require('../models/User')

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};

// var data = {
//     "type" : "physician" or "user",
// }

router.get('/', async function(req, res) {

    if (req.query.type) {
        if (req.query.type == 'physician') {
            try {
                if (!req.headers["x-auth"]) {
                    res.status(400).send(errorMsg)
                }
                else {
                    const decoded = jwt.decode(req.headers["x-auth"], secret)
                    const physician = await Physician.findOne({username: decoded.username})
                    res.status(200).send(physician)
                }
            }
            catch (ex) {
                res.status(400).send(errorMsg)
            }
        }

        else if (req.query.type == 'user') {
            try {
                if (!req.headers["x-auth"]) {
                    res.status(400).send(errorMsg)
                }
                else {
                    const decoded = jwt.decode(req.headers["x-auth"], secret)
                    const user = await User.findOne({username: decoded.username})
                    res.status(200).send(user)
                }
            }
            catch (ex) {
                res.status(400).send(errorMsg)
            }
        }
    }
    
    else {
        res.status(400).send(errorMsg1)
    }
})

module.exports = router;