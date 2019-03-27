let {gql} = require("apollo-server")

module.exports = gql`
  type Query {
    hello: String!
    company(id: ID!): Company!
    job(id: ID!): Job!
    jobs: [Job!]!
  }
  
  type Mutation {
    createJob(input: CreateJobInput): Job!
  }
  
  input CreateJobInput {
    companyId: ID!
    title: String!
    description: String!
  }
  
  type Company {
    id: ID!
    name: String!
    description: String!
    jobs: [Job!]!
  }
  
  type Job {
    id: ID! 
    title: String!
    description: String!
    company: Company!
  }
`
