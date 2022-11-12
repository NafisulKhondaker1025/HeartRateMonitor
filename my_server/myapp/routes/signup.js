var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Physician = require('../models/Physician');
var errorMsg1 = 'Signup Failed! Please specify all fields.';
var errorMsg2 = 'Signup Failed! Username Taken.';
var errorMsg3 = 'Signup Failed! Could not save to database';
var msg = {"Response" : "New User was created"}
var msg1 = {"Response" : "New Physician was created"}

// JUST FOR REFERENCE
// req.body {
//     type: Physician or User
//     user or physician: {     
//          username: any valid string
//          password: any valid string
//     }
// }

router.post('/', function(req, res) {
    alert("posted on router")
    if (!(req.body.type) || !(req.body.username) || !(req.body.password)) {
        res.status(400).send(errorMsg1);
    }
    else if (req.body.type === 'user') {
        let user = new User(req.body.user);
        user.save(function(err, user) {
            if (err) {
                res.status(400).send(errorMsg3);
            }
            else {
                res.status(200).send(msg);
            }
        })
    }
    else if (req.body.type === 'physician') {
        let physician = new Physician(req.body.physician);
        physician.save(function(err, physician) {
            if (err) {
                res.status(400).send(errorMsg3);
            }
            else {
                res.status(200).send(msg1);
            }
        })
    }
    else {
        res.status(400).send('Neither User nor Physician');
    }
})

module.exports = router;