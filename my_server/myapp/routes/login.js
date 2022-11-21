const express = require('express');
const jwt = require("jwt-simple")
const bcrypt = require("bcryptjs")
const router = express.Router();
const User = require('../models/User');
const Physician = require('../models/Physician');
const errorMsg1 ={'Error' : 'Login Failed! Please specify all fields.'};
const errorMsg2 ={'Error' : 'Login Failed! Incorrect Username or Password'};
const errorMsg3 ={'Error' : 'Login Failed! Incorrect Password'};
const msg = {"Success" : "Logging in!"}
const secret = "topSecret"

// JUST FOR REFERENCE
// req.body {
//     type: Physician or User
//     username: any valid string
//     password: any valid string
// }

router.post('/', async function(req, res) {
    if (!(req.body.type)) {
        res.status(400).send(errorMsg1);
    }
    else if (req.body.type === 'user') {
        if (req.body.user.username != '' && req.body.user.password != '') { 
            const user = await User.findOne({username: req.body.user.username})
            if(!user) {
                res.status(400).send(errorMsg2);
            }
            else {
                if(bcrypt.compareSync(req.body.user.password, user.password)) {
                    const token = jwt.encode({username: user.username}, secret)
                    res.json({token : token})
                }
                else {
                    res.status(400).json(errorMsg3)
                }
            }
        }
        else {
            res.status(400).send(errorMsg1);
        }
    }
    else if (req.body.type === 'physician') {
        if (req.body.physician.username != '' && req.body.physician.password != '') {
            const physician = await Physician.findOne({username: req.body.physician.username})
            if(!physician) {
                res.status(400).send(errorMsg2);
            }
            else {
                if(bcrypt.compareSync(req.body.physician.password, physician.password)) {
                    const token = jwt.encode({username: physician.username}, secret)
                    res.json({token : token})
                }
                else {
                    res.status(400).json(errorMsg3)
                }
            }
        }
        else {
            res.status(400).send(errorMsg1);
        }
    }
    else {
        res.status(400).send('Neither User nor Physician');
    }
})

module.exports = router;
