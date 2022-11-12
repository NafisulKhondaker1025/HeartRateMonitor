// var express = require('express');
// var router = express.Router();
// var Recording = require('../models/Recording');
// var errorMsg = {"error" : "zip and airQuality are required."}
// var msg = {"response" : "Data recorded."}

// router.post('/', function(req, res) {
//     if (!(req.body.zip) || !(req.body.airQuality)) {
//         res.status(400).send(errorMsg);
//     }
//     else {
//         let recording = new Recording(req.body);
//         recording.save(function(err, recording) {
//             if (err) {
//                 res.status(400).send(errorMsg);
//             }
//             else {
//                 res.status(201).send(msg);
//             }
//         })
//     }
// })

// module.exports = router;