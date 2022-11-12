const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/HeartRateMonitor", 
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
module.exports = mongoose;
