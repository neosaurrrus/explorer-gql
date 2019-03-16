const mongoose = require('mongoose');

//define schema
const driverSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    nationality: String,
    teamId: String
});

//define model
const driverModel = mongoose.model('Driver', driverSchema)

module.exports = driverModel;