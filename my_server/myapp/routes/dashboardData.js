const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const Physician = require('../models/Physician');
const User = require('../models/User')
const UTCconversion = 25200; //Used to change UTC time to Arizona time zone

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};

// var data = {
//     "type" : "heartRate" or "sp02",
// }

router.get('/', async function(req, res) {

    let endTime = new Date();
    let milliSeconds = endTime.getTime();
    let minutes = endTime.getMinutes();
    let hours = endTime.getHours();
    let seconds = endTime.getSeconds();
    let startTime = new Date (milliSeconds - ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000)) - (UTCconversion * 1000));
    milliSeconds = startTime.getTime();
    startTime.setTime(milliSeconds - (req.query.daysBack * 24 * 60 * 60 * 1000))
    milliSeconds = startTime.getTime();
    endTime.setTime(milliSeconds + (24 * 60 * 60 * 1000))

    let day = (startTime.getDate() + 1).toString()
    let month = (startTime.getMonth() + 1).toString()
    let year = startTime.getFullYear().toString()

    let responseArray = []
    let responseObject = {
        responseArray: [],
        date: month + "/" + day + "/" + year 
    }


    if (req.query.type) {
        if (req.query.type == 'heartRate') {
            try {
                if (!req.headers["x-auth"]) {
                    res.status(400).send(errorMsg)
                }
                else {
                    const decoded = jwt.decode(req.headers["x-auth"], secret)
                    const user = await User.findOne({username: decoded.username})
                    if (user.heartRate.length == 0) {
                        res.status(200).send([])
                    }
                    else {
                        for (item of user.heartRate) {
                            if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                responseObject.responseArray.push({
                                    x:  ((item.timeStamp.getHours() + 7) % 24) + (item.timeStamp.getMinutes() / 60),
                                    y:  item.reading 
                                })
                            }
                        }
                        res.status(200).send(responseObject)
                    }
                }
            }
            catch (ex) {
                res.status(400).send(errorMsg)
            }
        }

        else if (req.query.type == 'spo2') {
            try {
                if (!req.headers["x-auth"]) {
                    res.status(400).send(errorMsg)
                }
                else {
                    const decoded = jwt.decode(req.headers["x-auth"], secret)
                    const user = await User.findOne({username: decoded.username})
                    if (user.spo2.length == 0) {
                        res.status(200).send([])
                    }
                    else {
                        for (item of user.spo2) {
                            if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                responseObject.responseArray.push({
                                    x:  ((item.timeStamp.getHours() + 7) % 24) + (item.timeStamp.getMinutes() / 60),
                                    y:  item.reading 
                                })
                            }
                        }
                        res.status(200).send(responseObject)
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