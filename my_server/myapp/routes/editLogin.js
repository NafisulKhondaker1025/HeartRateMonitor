const express = require('express');
const jwt = require("jwt-simple")
const bcrypt = require("bcryptjs")
const router = express.Router();
const User = require('../models/User');
const Physician = require('../models/Physician');
const errorMsg1 ={'Error' : 'Failed! Please specify all fields.'};
const errorMsg4 = {'Error' : 'Failed! Username already exists.'};
const msg = {"Success" : "Logging in!"}
const secret = "topSecret"

// txData = {
//     type: "user",
//     username: $("#usernameEditLogin").val(),
//     oldPassword: $("#oldPasswordEditLogin").val(),
//     newPassword: $("#newPasswordEditLogin").val()
// }

router.post('/', async function(req, res) {
    if (!(req.body.type)) {
        res.status(400).send(errorMsg1);
    }
    else if (req.body.type === 'user') {
        try {
            const decoded = jwt.decode(req.headers["x-auth"], secret)
            const user = await User.findOne({username: decoded.username})
            if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
                let users = await User.find({username: req.body.username}) 
                if (users.length == 0 || decoded.username == req.body.username) {
                    const hash = bcrypt.hashSync(req.body.newPassword, 10);
                    User.updateOne({username: decoded.username}, {username : req.body.username, password: hash}, function(err, result) {
                        if (err) {
                            res.status(400).send(errorMsg1)
                        }
                        else if (result.n === 0) {
                            res.status(404).send(errorMsg1);
                        } 
                        else {
                            const token = jwt.encode({username: req.body.username}, secret)
                            res.status(200).send({token : token});
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
        catch {
            res.status(400).send(errorMsg1);
        }
    }
    else if (req.body.type === 'physician') {
        try {
            const decoded = jwt.decode(req.headers["x-auth"], secret)
            const physician = await Physician.findOne({username: decoded.username})
            if (bcrypt.compareSync(req.body.oldPassword, physician.password)) {
                let physicians = await Physician.find({username: req.body.username}) 
                if (physicians.length == 0 || decoded.username == req.body.username) {
                    const hash = bcrypt.hashSync(req.body.newPassword, 10);
                    Physician.updateOne({username: decoded.username}, {username : req.body.username, password: hash}, function(err, result) {
                        if (err) {
                            res.status(400).send(errorMsg1)
                        }
                        else if (result.n === 0) {
                            res.status(404).send(errorMsg1);
                        } 
                        else {
                            const token = jwt.encode({username: req.body.username}, secret)
                            res.status(200).send({token : token});
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
        catch {
            res.status(400).send(errorMsg1);
        }
    }
    else {
        res.status(400).send('Neither User nor Physician');
    }
})

module.exports = router;
