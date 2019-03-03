// This is using experimental Node so its an mjs and will need to run via  "--experimental-modules" to the "node index.js"

import express from "express";
import graphqlHTTP from "express-graphql"; //alows express to understand graphql
const app = express()

app.use("/graphql", graphqlHTTP({
    
}))






app.listen(3000, () => {
    console.log("Server is go on port 3000")
})



