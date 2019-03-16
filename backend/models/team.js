const mongoose = require('mongoose');

//define schema
const teamSchema = new mongoose.Schema({
    name: String,
    founded: Number
});

//define model
const teamModel = mongoose.model('Team', teamSchema)

module.exports = teamModel;