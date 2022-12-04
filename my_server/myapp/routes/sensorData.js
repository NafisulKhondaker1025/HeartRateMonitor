const express = require('express');
const jwt = require("jwt-simple")
const router = express.Router();
const User = require('../models/User');
const errorMsg = {'Error' : 'Invalid apiKey'};
const errorMsg1 = {'Error' : 'Invalid Request!'};
const msg = {'Success' : 'Data saved correctly'}
const UTCconversion = 25200; //Used to change UTC time to Arizona time zone
const secret = "topSecret";

// request = {
//     apiKey: apiKey for a deviceID,
//     heartRate: heartRate reading from device,
//     spo2: spo2 reading from device
//     timeStamp: current date and time from device     
// }

router.post('/', async function(req, res) {
    var sensorDateTime = new Date((parseInt(req.body.timeStamp) - UTCconversion) * 1000)
    try {
        if (!req.body.apiKey) {
            res.status(400).send(errorMsg)
        }
        else {
            const decoded = jwt.decode(req.body.apiKey, secret)
            const user = await User.findOne({deviceID: decoded.deviceID})
            const heart_Rate = {
                reading: req.body.heartRate,
                timeStamp: sensorDateTime
            }
            const spo_2 = {
                reading: req.body.spo2,
                timeStamp: sensorDateTime
            }
            User.updateOne({deviceID: decoded.deviceID}, {$push: {heartRate: heart_Rate, spo2: spo_2}}, function(err, result) {
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
    }
    catch (ex) {
        res.status(400).send(errorMsg)
    }
})

module.exports = router;