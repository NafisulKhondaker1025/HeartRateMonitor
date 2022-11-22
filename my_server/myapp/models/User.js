const db = require("../db");

// Create a model from the schema
var User = db.model("User", {
    username:  {type: String},
    password:  {type: String},
    profileFields: {
        fullName: {type: String},
        email: {type: String},
        phone: {type: String},
        address: {type: String},
    },
    deviceID: {type: String},
    apiKey: {type: String}
 });

module.exports = User;