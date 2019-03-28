let {gql} = require("apollo-server")

module.exports = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    fullname: String!
    companyId: ID!
  }
  
  type Company {
    id: ID!
    name: String!
    description: String!
    jobs: [Job!]!
    users: [User!]!
  }
  
  type Job {
    id: ID! 
    title: String!
    description: String!
    company: Company!
    user: User!
  }
  
  type Query {
    hello: String!
    company(id: ID!): Company!
    companies: [Company!]!
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
`
