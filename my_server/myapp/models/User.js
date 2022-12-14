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
    apiKey: {type: String},
    heartRate: [],
    spo2: [],
    physician: {type: String},
    min: {
        heartRate: {type: Number},
        spo2: {type: Number}
    },
    max: {
        heartRate: {type: Number},
        spo2: {type: Number}
    },
    avg: {
        heartRate: {type: Number},
        spo2: {type: Number}
    },
    startTime: {type: Number},
    endTime: {type: Number},
    timeInterval: {type: Number}
 });

module.exports = User;