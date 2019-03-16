
//So we will have Teams, with multiple drivers

const graphql = require("graphql");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} =  graphql;

const Driver = require("../models/driver");
const Team = require("../models/team");

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
                    return Team.findById(parent.teamId);
                  }
            }
    })
});

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
        },
        drivers: {
            type: new GraphQLList(driverType),
            resolve(parent,args){
                    return Driver.find({teamId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        drivers: {
            type: new GraphQLList(driverType),
            resolve(parent, args) {
                return Driver.find();
            }
        },
        teams: {
            type: new GraphQLList(teamType),
            resolve(parent, args){
                return Team.find();
            }
        },
        driver:{
            type: driverType,
            args: {id: {type: GraphQLID}}, //what they need to provide
            resolve(parent, args){
                return Driver.findById(args.id);
                }
            },
        team: {
            type: teamType, //which type to use
            args: {
                id: {
                    type: GraphQLID
                }
            }, //what they need to provide
            resolve(parent, args) {
                return Team.findById(args.id); 
            }
        }
    }
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTeam: {
            type: teamType, //What are we making?
            args: {         //What details are you providing?
                name: {type: new GraphQLNonNull(GraphQLString)},
                founded: {type: new GraphQLNonNull(GraphQLInt)}
            }, 
            resolve(parent, args){
                let team = new Team({ //Use the Team model defined in the DB plugging in arg values
                    name: args.name,
                    founded: args.founded
                })
                return team.save(); //Save it to DB and provide the result back
            }
        },
        addDriver: {
            type: driverType,
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                lastName:  {type: new GraphQLNonNull(GraphQLString)},
                nationality: {type: GraphQLString},
                teamId:   {type: GraphQLID}
            },
            resolve(parent,args){
                let driver = new Driver({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    nationality: args.nationality,
                    teamId: args.teamId
                })
                return driver.save();
            }
        }
    }
});


const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

module.exports = schema;