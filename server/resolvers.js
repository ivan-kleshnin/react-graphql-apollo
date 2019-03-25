let {AuthenticationError} = require("apollo-server")

module.exports = {
  Query: {
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

    login(_, {email, password}, {db}) {
      let user = db.users.list().find(user => {
        return user.email == email && user.password == password
      })
      if (!user) {
        throw new Error("Invalid Credentials")
      }
      // if (!user) return null
      return Buffer.from(email + ":" + password).toString("base64") // token
    }
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
