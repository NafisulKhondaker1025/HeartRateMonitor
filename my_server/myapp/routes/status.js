var express = require('express');
var router = express.Router();
var Recording = require('../models/Recording');
var errorMsg1 = {"error" : "a zip code is required."}
var errorMsg2 = {"error" : "Zip does not exist in the database."}

router.get('/', async function(req, res) {
    let regex = /(^\d{5}$)/;
    if (!(req.query.zip) || regex.test(req.query.zip)) {
        const recordings = await Recording.find( {zip: req.query.zip});
        if (!recordings || recordings.length === 0) {
            res.status(400).send(errorMsg2);
        } 
        else {
            let sum = 0
            for (let item of recordings) {
                sum += item.airQuality;
            }
            let average = (sum / recordings.length).toFixed(2);
            res.status(200).send(average);
        }
    }
    else {
        res.status(400).send(errorMsg1);
    }
})

module.exports = router;
