const db = require("../db");

// Create a model from the schema
var Physician = db.model("Physician", {
    username:  {type: String},
    password:  {type: String},
    profileFields: {
        fullName: {type: String},
        designation: {type: String},
        email: {type: String},
        phone: {type: String},
        institution: {type: String},
        address: {type: String}
    }
 });

module.exports = Physician;