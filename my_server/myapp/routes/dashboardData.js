const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");
const Physician = require('../models/Physician');
const User = require('../models/User')
const UTCconversion = 25200; //Used to change UTC time to Arizona time zone

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};

// txData = {
//     type: data_type,
//     daysBack: daysBack,
//     view: data_view
// }

router.get('/', async function(req, res) {
    if (req.query.type) {

        if (req.query.view == "daily") {

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

            let startTime_display = new Date(startTime.getTime() + (UTCconversion * 1000))

            let day = (startTime_display.getDate()).toString()
            let month = (startTime_display.getMonth() + 1).toString()
            let year = startTime_display.getFullYear().toString()

            let responseObject = {
                responseArray: [],
                date: month + "/" + day + "/" + year,
                min: 0,
                max: 0 
            }

            let resArr = []

            ///////////////////////////////////////////////////
            /////////        daily heartrate     //////////////
            ///////////////////////////////////////////////////
            if (req.query.type == 'heartRate') {
                try {
                    if (!req.headers["x-auth"]) {
                        res.status(400).send(errorMsg)
                    }
                    else {
                        const decoded = jwt.decode(req.headers["x-auth"], secret)
                        if (req.query.userID) {
                            var user = await User.findById(req.query.userID)
                        }
                        else {
                            var user = await User.findOne({username: decoded.username})
                        }
                        if (user.heartRate.length == 0) {
                            res.status(200).send([])
                        }
                        else {
                            for (item of user.heartRate) {
                                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                    responseObject.responseArray.push({
                                        x:  ((item.timeStamp.getHours() + 7) % 24) + (item.timeStamp.getMinutes() / 60),
                                        y:  parseInt(item.reading)
                                    })
                                    resArr.push(parseInt(item.reading))
                                }
                            }
                            responseObject.min = Math.min(...resArr)
                            responseObject.max = Math.max(...resArr)
                            res.status(200).send(responseObject)
                        }
                    }
                }
                catch (ex) {
                    res.status(400).send(errorMsg)
                }
            }

            ///////////////////////////////////////////////////
            /////////////        daily sp02      //////////////
            ///////////////////////////////////////////////////
            else if (req.query.type == 'spo2' && req.query.view == "daily") {
                try {
                    if (!req.headers["x-auth"]) {
                        res.status(400).send(errorMsg)
                    }
                    else {
                        const decoded = jwt.decode(req.headers["x-auth"], secret)
                        if (req.query.userID) {
                            var user = await User.findById(req.query.userID)
                        }
                        else {
                            var user = await User.findOne({username: decoded.username})
                        }
                        if (user.spo2.length == 0) {
                            res.status(200).send([])
                        }
                        else {
                            for (item of user.spo2) {
                                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                    responseObject.responseArray.push({
                                        x:  ((item.timeStamp.getHours() + 7) % 24) + (item.timeStamp.getMinutes() / 60),
                                        y:  parseInt(item.reading) 
                                    })
                                    resArr.push(parseInt(item.reading))
                                }
                            }
                            responseObject.min = Math.min(...resArr)
                            responseObject.max = Math.max(...resArr)
                            res.status(200).send(responseObject)
                        }
                    }
                }
                catch (ex) {
                    res.status(400).send(errorMsg)
                }
            }
        }

        else if (req.query.view == "weekly") {
            
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

            let startTime_display = new Date(startTime.getTime() + (UTCconversion * 1000))
            let endTime_display = new Date(endTime.getTime() + (UTCconversion * 1000) - (24 * 60 * 60 * 1000))



            //Get the date range for weekly data
            let day_start = (startTime_display.getDate()).toString()
            let month_start = (startTime_display.getMonth() + 1).toString()
            let year_start = startTime_display.getFullYear().toString()
            let day_end = (endTime_display.getDate()).toString()
            let month_end = (endTime_display.getMonth() + 1).toString()
            let year_end = endTime_display.getFullYear().toString()

            let dataArray = []

            let responseObject = {
                date_start: month_start + "/" + day_start + "/" + year_start,
                date_end: month_end + "/" + day_end + "/" + year_end,
                min: 0,
                max: 0,
                average: 0
            }
            
            ///////////////////////////////////////////////////
            /////////////     weekly heartrate   //////////////
            ///////////////////////////////////////////////////
            if (req.query.type == 'heartRate') {
                try {
                    if (!req.headers["x-auth"]) {
                        res.status(400).send(errorMsg)
                    }
                    else {
                        const decoded = jwt.decode(req.headers["x-auth"], secret)
                        if (req.query.userID) {
                            var user = await User.findById(req.query.userID)
                        }
                        else {
                            var user = await User.findOne({username: decoded.username})
                        }
                        if (user.heartRate.length == 0) {
                            res.status(200).send([])
                        }
                        else {
                            let sum = 0
                            for (item of user.heartRate) {
                                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                    dataArray.push(parseInt(item.reading))
                                    sum += parseInt(item.reading)
                                }
                            }
                            responseObject.min = Math.min(...dataArray)
                            responseObject.max = Math.max(...dataArray)
                            responseObject.average = Math.round(sum / dataArray.length)
                            res.status(200).send(responseObject)
                        }
                    }
                }
                catch (ex) {
                    res.status(400).send(errorMsg)
                }
            }


            ///////////////////////////////////////////////////
            ///////////////     weekly spo2      //////////////
            ///////////////////////////////////////////////////
            else if (req.query.type == 'spo2') {
                try {
                    if (!req.headers["x-auth"]) {
                        res.status(400).send(errorMsg)
                    }
                    else {
                        const decoded = jwt.decode(req.headers["x-auth"], secret)
                        if (req.query.userID) {
                            var user = await User.findById(req.query.userID)
                        }
                        else {
                            var user = await User.findOne({username: decoded.username})
                        }
                        if (user.spo2.length == 0) {
                            res.status(200).send([])
                        }
                        else {
                            let sum = 0
                            for (item of user.spo2) {
                                if (item.timeStamp.getTime() > startTime.getTime() && item.timeStamp.getTime() < endTime.getTime()) {
                                    dataArray.push(parseInt(item.reading))
                                    sum += parseInt(item.reading)
                                }
                            }
                            responseObject.min = Math.min(...dataArray)
                            responseObject.max = Math.max(...dataArray)
                            responseObject.average = Math.round(sum / dataArray.length)
                            res.status(200).send(responseObject)
                        }
                    }
                }
                catch (ex) {
                    res.status(400).send(errorMsg)
                }
            }   
        }
    }
    
    else {
        res.status(400).send(errorMsg1)
    }
})

module.exports = router;