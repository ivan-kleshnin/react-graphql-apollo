let getFields = require("graphql-fields")

module.exports = {
  Query: {
    hello(_, __, {me}) {
      let fullname = me.fullname || "Anonymous"
      return `Hello ${fullname}!`
    },

    company(_, {id}, {db}) {
      let company = db.companies.get(id) //
      if (!company) {
        throw Error("Company not found") // ???
      }
      return company
    },

    companies(_, args, {db}) {
      return db.companies.list()
    },

    job(_, {id}, {db, me, allowed}, info) {
      let job = db.jobs.get(id)
      if (!job) {
        throw Error("Job not found")
      }

      // let fields = Object.keys(getFields(info))
      // for (let field of fields) {
      //   console.log("me.role:", me.role)
      //   let status = me.id == job.userId ? "self" : "other"
      //   console.log("status:", status)
      //   let permission = `query.job.${field}.${status}`
      //   console.log("checking permission:", permission)
      //   if (!allowed([me.role], permission)) {
      //     throw Error(`Not allowed to ${permission}`)
      //   }
      // }

      return job
    },

    jobs(_, args, {db}) {
      return db.jobs.list()
    },

    user(_, {id}, {db, me, authorize}, info) {
      let user = db.users.get(id)
      if (!user) {
        throw Error("User not found")
      }

      // console.log("me:", me)

      let status = me.id == user.id ? "self" : "any"
      authorize(`query.${status}.${user.role}`, info)

      return user
    },

    users(_, {}, {db, me, authorize}, info) {
      let users = db.users.list()

      for (let user of users) {
        let status = me.id == user.id ? "self" : "any"
        authorize(`query.${status}.${user.role}`, info)
      }

      return users
    }
  },

  Mutation: {
    createJob(_, {input}, {me, db, authorize}, info) {
      authorize(`create.job`)
      let id = db.jobs.create({...input, createdByUserId: me.id})
      let job = db.jobs.get(id)
      return job
    },
  },

  User: {
    createdCompanies(user, {}, {db}) {
      return db.companies.list().filter(company => company.createdByUserId == user.id)
    },

    createdJobs(user, {}, {db}) {
      return db.jobs.list().filter(job => job.createdByUserId == user.id)
    },

    employedBy(user, {}, {db}) {
      return db.companies.get(user.employedByCompanyId)
    },

    appliedTo(user, {}, {db}) {
      return db.applications.list()
        .filter(application => application.userId == user.id)
        .map(application => {
          return db.jobs.get(application.jobId)
        })
    },
  },

  Company: {
    createdBy(company, {}, {db}) {
      return db.users.get(company.createdByUserId)
    },

    employees(company, {}, {db}) {
      return db.users.list().filter(user => user.employedByCompanyId == company.id)
    },

    jobs(company, {}, {db}) {
      return db.jobs.list().filter(job => job.companyId == company.id)
    },
  },

  Job: {
    createdBy(job, {}, {db}) {
      return db.users.get(job.createdByUserId)
    },

    company(job, {}, {db}) {
      return db.companies.get(job.companyId)
    },

    applicants(job, {}, {db}) {
      return db.applications.list()
        .filter(application => application.jobId == job.id)
        .map(application => {
          return db.users.get(application.userId)
        })
    },
  },
}

// let fields = info.fieldNodes.flatMap(node => node.selectionSet.selections.flatMap(selection => {
//   return selection.name.value
// }))
// <==>
// let fields = Object.keys(getFields(info))
