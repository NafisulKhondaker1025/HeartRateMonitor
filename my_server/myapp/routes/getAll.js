const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const Physician = require('../models/Physician');
const User = require('../models/User')

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};

// txData = {
//     type: "physician" or "user",
// }

// {
//     fullName:
//     designation:
//     institution:
//     email:
//     phone:
//     objID:
// },

// {
//     fullName:
//     email:
//     average:
//     min:
//     max:  
// },

router.get('/', async function(req, res) {

    var responseArrayPhysicians = []
    var responseArrayUsers = []

    if (req.query.type) {
        if (req.query.type == 'physician') {
            try {
                if (!req.headers["x-auth"]) {
                    res.status(400).send(errorMsg)
                }
                else {
                    const decoded = jwt.decode(req.headers["x-auth"], secret)
                    const physicians = await Physician.find()
                    for (item of physicians) {
                        responseArrayPhysicians.push(
                            {
                                fullName: item.profileFields.fullName,
                                designation: item.profileFields.designation,
                                institution: item.profileFields.institution,
                                email: item.profileFields.email,
                                phone: item.profileFields.phone,
                                objID: item._id
                            }
                        )
                    }
                    res.status(200).send(responseArrayPhysicians)
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
                    const physician = await Physician.findOne({username: decoded.username})
                    const users = await User.find({physician: physician._id})
                    if (users.length == 0) {
                        res.status(200).send([])
                    }
                    else {
                        for (item of users) {
                            responseArrayUsers.push(
                                {
                                    fullName: item.profileFields.fullName,
                                    email: item.profileFields.email,
                                    min: item.min.heartRate,
                                    max: item.max.heartRate,
                                    avg: item.avg.heartRate,
                                    objID: item._id
                                }
                            )
                        }
                        res.status(200).send(responseArrayUsers)
                    }
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