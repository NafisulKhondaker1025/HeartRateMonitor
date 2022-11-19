const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require('../models/User');
const Physician = require('../models/Physician');
const errorMsg1 = {'Error' : 'Signup Failed! Please specify all fields.'};
const errorMsg2 = {'Error' : 'Signup Failed! Username Taken.'};
const errorMsg3 = {'Error' : 'Signup Failed! Could not save to database.'};
const errorMsg4 = {'Error' : 'Signup Failed! Username already exists.'};
const msg = {"Success" : "New User was created"}
const msg1 = {"Success" : "New Physician was created"}

// JUST FOR REFERENCE
// req.body {
//     type: Physician or User
//     user or physician: {     
//          username: any valid string
//          password: any valid string
//     }
// }

router.post('/', async function(req, res) {
    if (!(req.body.type)) {
        res.status(400).send(errorMsg1);
    }
    else if (req.body.type === 'user') {
        if (req.body.user.username != '' && req.body.user.password != '') {
            let users = await User.find({username: req.body.user.username});
            if (users.length == 0) {
                const hash = bcrypt.hashSync(req.body.user.password, 10);
                const user = new User({
                    username : req.body.user.username,
                    password : hash
                });
                user.save(function(err, user) {
                    if (err) {
                        res.status(400).send(errorMsg3);
                    }
                    else {
                        res.status(200).send(msg);
                    }
                })
            }
            else {
                res.status(400).send(errorMsg4);
            }
        }
        else {
            res.status(400).send(errorMsg1);
        }
    }
    else if (req.body.type === 'physician') {
        if (req.body.physician.username != '' || req.body.physician.password != '') {
            let physicians = await Physician.find({username: req.body.physician.username});
            if (physicians.length == 0) {
                const hash = bcrypt.hashSync(req.body.physician.password, 10);
                const physician = new Physician({
                    username : req.body.physician.username,
                    password : hash
                });
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
                res.status(400).send(errorMsg4);
            }
        }
        else {
            res.status(400).send(errorMsg1);
        }
    }
    else {
        res.status(400).send({'Error' : 'Neither User nor Physician'});
    }
})

module.exports = router;