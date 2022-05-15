const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    cars: [Car!]!}

  type Mutation{
    groupDelete(groupId: ID!)
    groupPublish(groupId: ID!)
    groupUnpublish(groupId: ID!)
    groupCreate(
      groupInput: GroupInput
    )
    groupUpdate(
      groupId: ID!
      groupInput: GroupInput
    ): GroupUpdatePayload
    groupAddCars(groupId: ID!, carId: ID!)
    groupRemoveCars(groupId: ID!, carId: ID!)
  }

  input ImageInput {
    url: String!
  }

  input GroupInput {
    name: String
    image: ImageInput
    description: String
    featureSet: GroupFeatureFields
  }

  type GroupUpdatePayload {
    userErrors: [UserErrors!]!
    group: Group
  }

  type UserErrors {
    message: String!
    field: [String!]!
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }  

  type Group {
    id: ID!
    featureSet: GroupFeatureSet
    hasCar(id: ID!): Boolean!
    cars(skip: Int!, take: Int!): [Car!]!
    name: String!
    image: Image!
    description: String!
  }

  type Image {
    id: ID!
    URL: String!
  }

  type GroupFeatureSet {
    features: [GroupFeatures!]!  // 特征数组
    applyFeaturesSeperately: GroupFeatureFields!  // 是否开启
  }

  type GroupFeatures {
    features: 
  }

  enum GroupFeatureFields {
    INCLINE_ENGINE
    FOUR_CYLINDER_ENGINE
    TWIN_CYLINDER_ENGINE
    RED_PAINT
    BLACK_PAINT
  }
`
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: 'blue', make: 'Toyota' }]
    }
  }
})

server.listen(3000).then(({ url }) => {
  console.log(`Server is ready at ${url}`)
})
