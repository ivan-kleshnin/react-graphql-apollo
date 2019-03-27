let {AuthenticationError} = require("apollo-server")

module.exports = {
  Query: {
    hello(_, __, {user}) {
      let username = user ? user.fullname || user.email : "Guest"
      return `Hello ${username}!`
    },

    company(_, {id}, {db}) {
      let company = db.companies.get(id) //
      if (!company) {
        throw Error("Company not found") // ???
      }
      return company
    },

    job(_, {id}, {db}) {
      let job = db.jobs.get(id)
      if (!job) {
        throw Error("Job not found") // ???
      }
      return job
    },

    jobs(_, args, {db, user}) {
      return db.jobs.list()
    },
  },

  Mutation: {
    createJob(_, {input}, {user, db}) {
      if (!user) {
        throw new AuthenticationError("Not Authorized")
      }
      let id = db.jobs.create(input)
      let job = db.jobs.get(id)
      return job
    },
  },

  Job: {
    company(job, args, {db}) {
      return db.companies.get(job.companyId)
    }
  },

  Company: {
    jobs(company, {}, {db}) {
      return db.jobs.list().filter(job => job.companyId == company.id)
    }
  }
}
