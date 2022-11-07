const db = require("../db");

// Create a model from the schema
var Recording = db.model("Recording", {
    zip:      {type: Number},
    airQuality:  {type: Number}
 });

module.exports = Recording;