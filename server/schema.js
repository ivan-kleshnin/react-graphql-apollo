let {gql} = require("apollo-server")

module.exports = gql`
  type Query {
    company(id: ID!): Company!
    job(id: ID!): Job!
    jobs: [Job!]!
  }
  
  type Mutation {
    createJob(input: CreateJobInput): Job!
    login(email: String!, password: String!): String!
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
