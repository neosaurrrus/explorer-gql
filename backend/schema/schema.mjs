
//So we will have Teams, with multiple drivers


import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} from "graphql";

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



const driverType = new GraphQLObjectType({
    name:"Driver",
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        nationality: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        driver:{
            type: driverType,
            args: {id: {type: GraphQLString}}, //what they need to provide
            resolve(parent, args){
                //code to get data from DB /or whatever
                return drivers.find( (driver) => {
                    if (driver.id === args.id) return driver;
                });
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery
})

export default schema;

