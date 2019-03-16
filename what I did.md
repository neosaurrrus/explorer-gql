
# Backend

## The very basics
- Created Folders
- npm init
- installed express
- got basic express
- set up git and github

## GraphQL setup.
- installed graphql and express-graphql
- imported them
- set up first route = app.use("graphql", graphqlHTTP)

### Schema setup

- Make folder and file called schema
- import graphql

The schema sets out:

1. What types the database should contain.
2. The relationships between them, 
3. Defining root queries, a description how how user can access the graph

We cant just use JS Objects and Strings to define it. We need to use GraphQL versions so we need to get access to them from graphql to use them:

`import { GraphQLObjectType,GraphQLString,GraphQLSchem} from "graphql"`


### Defining a Type

You can make a type like so:

```js
driverType = new GraphQLObjectType({
    name:"Driver",
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        nationality: {type: GraphQLString}
    })
});
```


### Defining a Root Query

A Root Query exists to give users (such as a front end) a way to talk to GraphQL. To do this we need to define:

1. What type we are looking for
2. Any arguments the user needs to provide so we can find the relevant thing such as an id
3. A resolver function that actually does the job of going to the DB and grabbing the information.

An example looks like this:

```js
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        driver:{
            type: driverType,
            args: {id: {type: GraphQLString}}, //what they need to provide
            resolve(parent, args){
                //code to get data from DB /or whatever
            }
        }
    }
});
```

Once you have done this, finally you have to export the schema to be used elsewhere:

`export default new GraphQLSchema({query: RootQuery})`

(I like to have the schema in a seperate const, for the sake of clarity)

### Building the Resolve Function

The resolve part of the RootQuery does the magic of going to a DB or other data source and retrieing the data to resolve the query.

It doesnt have to be a DB, lets take the following array:

```js
const drivers = [
    {
        id: "1",
        firstName: "Lewis",
        lastName: "Hamilton",
        nationality: "British"
    },
    {
        id: "2",
        firstName: "Valteri",
        lastName: "Bottas",
        nationality: "Finnish"
    },
    {   
        id: "3",
        firstName: "Sebastian",
        lastName: "Vettel",
        nationality: "German"
    }
];
```

For this we can write the following resolver function when we query a driver:

```js
 resolve(parent, args){
                //code to get data from DB /or whatever
                return drivers.find( (driver) => {
                    if (driver.id === args.id) return driver
                })
```

### Finishing the Schema

Lastly you want to export the query: `export default schema;`

And then we can use the schema in our endpoint in our app.ejs:

```js
app.use("/graphql", graphqlHTTP({
    schema
}));
```

If all has gone to plan, you should get a message saying basically: `Must provide query string`

So it can find the schema now, but now it wants a query string hmmm

## Providing a query String

So when it says that you need a query string, what it is saying is that you haven't asked it any question yet so it doesnt know what to do. So lets make a query.

We cant (easily) query it by just going to the URL, we need to talk to it in the right way. This is likely to be our front-end application but we have a tool to avoid us having to write a whole front end just to test a query. Enter **Graphiql**

if we add `graphiql:true` to the graphqlHTTP object, when we goto the url we instead will see a graphiQl tool that we can use.

GraphQL Playground is a standalong desktop application you can also install to do the same thing if you point it as the same endpoint.

Here, this is a typical query we could do:

```js
{
    driver(id:"1"){ //Note: it must be double quotes
        firstName
    }
}

//if it goes well it should return something like:
{
  "data": {
    "driver": {
      "firstName": "Lewis"
    }
  }
}
```

Graphiql is pretty cool, also note the ability to view docs which guides you to the types of queries are possible, what arguments are needed.

### Making a Proper ID

The ID is currently a string, but really we should be using the ID field. This is easy enough as it just requires a type of `GraphQLID` which is part of graphQL.

Once you have it imported, we need to change the reference in the type and also the resolver to have it working.

## Creating a 2nd Type

Now lets specify some Formula 1 teams. This requires three things:

1. A Teams Array
2. Teams Object Type 
3. Teams Resolver 

This looks like this: 

```js
const teams = [
    {
        name: "Mercedes",
        founded: 1954.
        id: '1'
    },
    {
        name: "Ferrari",
        founded: 1947,
        id: '2'
    }
]

const teamType = new GraphQLObjectType({
    name: "Team",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        founded: {
            type: GraphQLInt
        }
    })
});

// Part of the RootQueries
teams: {
            type: teamType,
            args: {
                id: {
                    type: GraphQLID
                }
            }, //what they need to provide
            resolve(parent, args) {
                //code to get data from DB /or whatever
                return teams.find((team) => {
                    if (team.id === args.id) return team;
                });
            }
        }
```

### Hooking up Drivers to Teams - Type Relations

So far so good, lets begin hooking up some relationships and make this a graph.

So, for non-F1 fans out there. A few of our drivers will belong to one team, and some to another. We need to hook it up accordingly so that relationship is shown.

1. Add the relationship to each driver array object via ids:

```js
{
    id: "1",
    teamId: "1",
    firstName: "Lewis",
    lastName: "Hamilton",
    nationality: "British"
}
```

2. Add the team as a field in the driverType. The type it will be is a ... teamType! This is where we use the parent argument to provide the teamID. Here is the new driver type:

```js
const driverType = new GraphQLObjectType({
    name:"Driver",
    fields: () => ({
        id: {type: GraphQLID},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        nationality: {type: GraphQLString},
        team: {
                type: teamType,
                resolve(parent, args){
                     return teams.find((team) => {
                         if (team.id === parent.teamId) return team;
                     });
                }

            }
    })
});
```
y
FYI, in case you wondered...you make fields a function due to a quirk of JS i am going to explain badly. If it were just an object, it would not  be able to reference the other types and then error out. By making it a function it doesnt run till the schema file has been read top to bottom.
If it all went to plan you should be use to use the following query and get the results shown:

```js
//Query
{
  driver(id: 2){
    firstName
    team{
      name
    }
  }
}
//Results
{
  "data": {
    "driver": {
      "firstName": "Valteri",
      "team": {
        "name": "Mercedes"
      }
    }
  }
}
```

Pretty cool! We should probably get the drivers if we query teams too...So lets do that. 

But wait. Whereas Drivers only driver for one team, a team may have multiple drivers and how do we say we need multiple `driverType`'s?

**We need a GraphQLList**

So thats another thing to import from GraphQL.

Once you have done that you can set that as the type like so:

`drivers: {type: new GraphQLList(driverType)}`

We need to say what this list of driverTypes will consist of, so it needs a resolver function. Since we want all the drivers for a given team, our resolver will look like this:

```js
resolve(parent, args){
                     return teams.find((team) => {
                         if (team.id === parent.teamId) return team;
                     });
                }
```

So lets test it out!

```js
{
  team(id:1){
    name
    drivers{
      firstName
    }
  }
}

// This will return...

{
  "data": {
    "team": {
      "name": "Mercedes",
      "drivers": [
        {
          "firstName": "Lewis"
        },
        {
          "firstName": "Valteri"
        }
      ]
    }
  }
}
```

### Returning all things

So far we have looked at returning a given item when giving an id as an argument. But its fairly common to want to return all of a given Type. So lets set up some queries that do just that.

If we look at our root queries, we can add a drivers query as follows:

```js
drivers: {
    type: new GraphQLList(driverType),
    resolve(parent, args)
        return drivers
    }
}
```

This pattern can be used for Teams in a similar way. Its that easy!





# Moving from Arrays to a Database

Ok, we have used an array for Drivers and Teams, but really we want to have a database to keep things more permanently. There is a douzen ways of doing this but I am going to install a local mongoose database. 

## Installing Mongodb

mLab is probably easier but I do alot fo work offline so it is more useful for me. Since this is highly variable i'll do the short version of this.

1. `npm install -g mongodb
2. Try and get it working with `mongod`. If it fails because of saying data/db not found then, it might be a permissioning issue like I had. Can grant permissions or use sudo.
3. While we are on the subject we might as well install mongoose which will give us some easier methods to interact with our DB.

4. in App.js (or in a seperate file) do something like this:

```js
const mongo = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const url = 'mongodb://localhost:27017';

mongo.connect(url, (err, client) => {
    if (err) {
        console.error(err)
        return;
    }
    console.log("MonogoDB Connected")
    const db = client.db('formula1')
    const collection = client.db('competitors')
});
```

## The Mongodb Models

We need to define the data stored within Mongodb. So lets make a schema for 2 mongodb models for team and driver.

In a folder called models we can create a js file for both `driver.js` and `team.js`.

1. First each of them requires mongoose so lets require that: `const mongoose = require('mongoose')`

2. A model consists of a schema and a collection name, so lets make the schema:

```js
const driverSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    nationality: String,,
    teamId: String
})
```

3. Lets create the model: `const driverModel = mongoose.model('Driver', driverSchema);`

4. Finally export it: `module.exports = driverModel`

I think you get the idea of how the teams model would look like.

If you are eagle-eyed you'd notice the lack of ID. This is because mongodb will handle that for these items.

## Using our models

If we go back to the schema.js, i.e the graphql schema. We can use these models instead of the placeholder arrays, and we need to change our resolver functions to query the database.

But wait... they wont be able to query anything useful from a blank database will they? Hmm we better change that.