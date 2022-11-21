const express = require('express');
const router = express.Router();
const jwt = require("jwt-simple");

const secret = "topSecret"
const errorMsg = {'Error' : 'Invalid Token, please sign in first'};
const errorMsg1 = {'Error' : 'Invalid Request!'};

// var data = {
//     "type" : "physician",
//     "token" : localStorage.getItem("token")
// }

router.post('/', async function(req, res) {

    if (req.body.type && req.body.token) {
        if (req.body.type == 'physician') {
            const token = req.body.token
            try {
                const decoded = jwt.decode(token, secret)
                let path = __dirname.replace("routes", "public\\")
                res.redirect(path + 'physician.html');
                console.log(path);
            }
            catch (ex) {
                console.log(ex)
                res.status(400).send(errorMsg)
            }
        }
    }
    else {
        res.status(400).send(errorMsg1)
    }
})

module.exports = router;