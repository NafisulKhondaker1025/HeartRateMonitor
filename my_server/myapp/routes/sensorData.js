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
            const heart_Rate = {
                reading: req.body.heartRate,
                timeStamp: sensorDateTime
            }
            const spo_2 = {
                reading: req.body.spo2,
                timeStamp: sensorDateTime
            }
            const user = await User.findOne({deviceID: decoded.deviceID})

            let heartRateDataArray = []
            let spo2DataArray = []
            heartRateDataArray.push(req.body.heartRate)
            spo2DataArray.push(req.body.spo2)

            let sum = 0
            let sum1 = 0

            let endTime = new Date();
            let milliSeconds = endTime.getTime();
            let minutes = endTime.getMinutes();
            let hours = endTime.getHours();
            let seconds = endTime.getSeconds();
            let startTime = new Date (milliSeconds - ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000)) - (UTCconversion * 1000));
            milliSeconds = startTime.getTime();
            startTime.setTime(milliSeconds - (6 * 24 * 60 * 60 * 1000))
            milliSeconds = startTime.getTime();
            endTime.setTime(milliSeconds + (7 * 24 * 60 * 60 * 1000))

            for (item of user.heartRate) {
                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                    heartRateDataArray.push(parseInt(item.reading))
                    sum += parseInt(item.reading)
                }
            }

            for (item of user.spo2) {
                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                    spo2DataArray.push(parseInt(item.reading))
                    sum1 += parseInt(item.reading)
                }
            }

            User.updateOne({deviceID: decoded.deviceID}, {
                $push: {heartRate: heart_Rate, spo2: spo_2},
                min: {
                    heartRate: Math.min(...heartRateDataArray),
                    spo2: Math.min(...spo2DataArray)
                },
                max: {
                    heartRate: Math.max(...heartRateDataArray),
                    spo2: Math.max(...spo2DataArray)
                },
                avg: {
                    heartRate: Math.round(sum / heartRateDataArray.length),
                    spo2: Math.round(sum1 / spo2DataArray.length)
                }
            }, function(err, result) {
                if (err) {
                    res.status(400).send(errorMsg1)
                }
                else if (result.n === 0) {
                    res.status(404).send(errorMsg1);
                } 
                else {
                    let st = user.startTime.toString()
                    let et = user.endTime.toString()
                    let ti = user.timeInterval.toString()
                    if (user.startTime < 10) {
                        st = "0" + user.startTime.toString()
                    }
                    if (user.endTime < 10) {
                        et = "0" + user.endTime.toString()
                    }
                    if (user.timeInterval < 10) {
                        ti = "0" + user.timeInterval.toString()
                    } 
                    res.status(200).send({
                        startTime: st,
                        endTime: et,
                        timeInterval: ti
                    });
                }
            })
        }
    }
    catch (ex) {
        res.status(400).send(errorMsg)
    }
})

module.exports = router;