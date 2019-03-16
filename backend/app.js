// This is using experimental Node so its an mjs and will need to run via  "--experimental-modules" to the "node index.js"

const express = require("express");
const graphqlHTTP = require("express-graphql"); //alows express to understand graphql
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors')

//allow cross-origin requests
app.use(cors())

const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/formula1';

mongoose.connect(url);

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql:true
}));


app.listen(5000, () => {
    console.log("Server is go on port 5000")
});


