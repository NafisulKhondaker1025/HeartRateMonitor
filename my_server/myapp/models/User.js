const db = require("../db");

// Create a model from the schema
var User = db.model("User", {
    username:      {type: String},
    password:  {type: String}
 });

module.exports = User;