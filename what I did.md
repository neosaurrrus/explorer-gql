
# Backend

## The very basics
- Created Folders
- npm init
- installed express
- got basic express running using experimental build)
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

### Testing our Query

Lastly you want to export the query: `export default schema;`

And then we can use the schema in our endpoint in our app.ejs:

```js
app.use("/graphql", graphqlHTTP({
    schema
}));
```