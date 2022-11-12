var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Physician = require('../models/Physician');
var errorMsg1 = 'Signup Failed! Please specify all fields.';
var errorMsg2 = 'Signup Failed! Username Taken.';

// req.body {
//     type: Physician or User
//     username: any valid string
//     password: any valid string
// }

router.post('/', function(req, res) {
    if (!(req.body.type) || !(req.body.username) || !(req.body.password)) {
        res.status(400).send(errorMsg1);
    }
    else if (req.body.type === 'user') {

    }
    else if (req.body.type === 'physician') {

    }

    else {
        
    }
})

module.exports = router;