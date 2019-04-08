require("dotenv").config({path: "__mocks__/.env"}) // TODO place into the global setup file
let R = require("ramda")
let FS = require("fs")
let request = require("supertest")
let app = require("../app")
let db = require("../db")
let sign = require("../sign")

// Jest runs same-file tests sequentially
// test("/200 responds with 200", async () => {
//   let response = await request(app).get("/200")
//   expect(response.statusCode).toBe(200)
// })
//
// test("/404 responds with 404", async () => {
//   let response = await request(app).get("/404")
//   expect(response.statusCode).toBe(404)
// })

let requestAs = (asUser) => async (q) => {
  let token
  if (asUser) {
    token = await sign(asUser.id, "secret")
  }
  let response = await request(app).post("/graphql")
    .set(asUser ? {"Authorization": `bearer ${token}`} : {})
    .send({
      query: q
    })
  let body = response.body || {}
  // console.log("response.body:", body)
  return {
    data: body.data || null,
    errors: body.errors || [],
  }
}

test("query.hello", async () => {
  console.log("test see process.env.DATA_DIR as:", process.env.DATA_DIR)
  // let response = await query(
  //   `query {
  //     hello
  //   }`
  // )
  // expect(response.statusCode).toBe(200)
  // expect(response.body).toEqual({data: {hello: "Hello Anonymous!"}})
})

describe("visitor", () => {
  let go, dbDump

  beforeAll(() => {
    go = requestAs(null)
    dbDump = {
      applications: db.applications.list(),
      companies: db.companies.list(),
      jobs: db.jobs.list(),
      users: db.users.list(),
    }
  })

  afterAll(() => {
    console.log("@ teardown")
    FS.writeFileSync("__mocks__/applications.json", JSON.stringify(dbDump.applications, null, 2))
    FS.writeFileSync("__mocks__/companies.json", JSON.stringify(dbDump.companies, null, 2))
    FS.writeFileSync("__mocks__/jobs.json", JSON.stringify(dbDump.jobs, null, 2))
    FS.writeFileSync("__mocks__/users.json", JSON.stringify(dbDump.users, null, 2))
  })

  test("can see some fields of a talent", async () => {
    let talent = db.users.get("t1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { id fullname }
      }`)
      let expectedUser = R.pick(["id", "fullname"], talent)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    async function case2() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { password }
      }`)
      let expectedMessage = `Not authenticated`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return Promise.all([
      case1(), case2()
    ])
  })

  test("can't see any fields of a manager", async () => {
    let manager = db.users.get("m1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${manager.id}") { id }
      }`)
      let expectedMessage = `Not authenticated`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })

  test("can't see any fields of an admin", async () => {
    let admin = db.users.get("a1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${admin.id}") { id }
      }`)
      let expectedMessage = `Not authenticated`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })

  test("can't create jobs", async () => {
    async function case1() {
      let {data, errors} = await go(`mutation {
        createJob(input: {
          title: "New Job"
          description: "..."
          companyId: "1"
        }) { id }
      }`)
      let expectedMessage = `Not authenticated`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })
})

describe("talent", () => {
  let me, go, dbDump

  beforeAll(() => {
    me = db.users.get("t1")
    go = requestAs(me)
    dbDump = {
      applications: db.applications.list(),
      companies: db.companies.list(),
      jobs: db.jobs.list(),
      users: db.users.list(),
    }
  })

  afterAll(() => {
    console.log("@ teardown")
    FS.writeFileSync("__mocks__/applications.json", JSON.stringify(dbDump.applications, null, 2))
    FS.writeFileSync("__mocks__/companies.json", JSON.stringify(dbDump.companies, null, 2))
    FS.writeFileSync("__mocks__/jobs.json", JSON.stringify(dbDump.jobs, null, 2))
    FS.writeFileSync("__mocks__/users.json", JSON.stringify(dbDump.users, null, 2))
  })

  test("can see all fields of themself", async () => {
    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${me.id}") { password }
      }`)
      let expectedUser = R.pick(["password"], me)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    return case1()
  })

  test("can see some fields of another talent", async () => {
    let talent = db.users.get("t2")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { id fullname }
      }`)
      let expectedUser = R.pick(["id", "fullname"], talent)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    async function case2() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { password }
      }`)
      let expectedMessage = "Not allowed to query.any.talent.password"
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return Promise.all([
      case1(), case2()
    ])
  })

  test("can't see any fields of a manager", async () => {
    let manager = db.users.get("m1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${manager.id}") { id }
      }`)
      let expectedMessage = `Not allowed to query.any.manager.id`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })

  test("can't see any fields of an admin", async () => {
    let admin = db.users.get("a1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${admin.id}") { id }
      }`)
      let expectedMessage = `Not allowed to query.any.admin.id`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })

  test("can't create jobs", async () => {
    async function case1() {
      let {data, errors} = await go(`mutation {
        createJob(input: {
          title: "New Job"
          description: "..."
          companyId: "1"
        }) { id }
      }`)
      let expectedMessage = `Not allowed to create.job`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })
})

describe("manager", () => {
  let me, go, dbDump

  beforeAll(() => {
    console.log("@ setup")
    me = db.users.get("m1")
    go = requestAs(me)
    dbDump = {
      applications: db.applications.list(),
      companies: db.companies.list(),
      jobs: db.jobs.list(),
      users: db.users.list(),
    }
  })

  afterAll(() => {
    console.log("@ teardown")
    FS.writeFileSync("__mocks__/applications.json", JSON.stringify(dbDump.applications, null, 2))
    FS.writeFileSync("__mocks__/companies.json", JSON.stringify(dbDump.companies, null, 2))
    FS.writeFileSync("__mocks__/jobs.json", JSON.stringify(dbDump.jobs, null, 2))
    FS.writeFileSync("__mocks__/users.json", JSON.stringify(dbDump.users, null, 2))
  })

  test("can see all fields of themself", async () => {
    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${me.id}") { password }
      }`)
      let expectedUser = R.pick(["password"], me)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    return case1()
  })

  test("can see some fields of a talent", async () => {
    let talent = db.users.get("t1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { id fullname }
      }`)
      let expectedUser = R.pick(["id", "fullname"], talent)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    async function case2() {
      let {data, errors} = await go(`query {
        user(id: "${talent.id}") { password }
      }`)
      let expectedMessage = "Not allowed to query.any.talent.password"
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return Promise.all([
      case1(), case2()
    ])
  })

  test("can't see any fields of an admin", async () => {
    let admin = db.users.get("a1")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${admin.id}") { id }
      }`)
      let expectedMessage = `Not allowed to query.any.admin.id`
      expect(data).toBe(null)
      expect(errors[0].message).toEqual(expectedMessage)
    }

    return case1()
  })

  test("can create jobs", async () => {
    async function case1() {
      let {data, errors} = await go(`mutation {
        createJob(input: {
          title: "New Job"
          description: "..."
          companyId: "1"
        }) { id }
      }`)
      let job = db.jobs.list().pop()
      let expectedResult = R.pick(["id"], job)
      expect(errors).toEqual([])
      expect(data.createJob).toEqual(expectedResult)
    }

    return case1()
  })
})

describe("admin", () => {
  let me, go

  beforeAll(() => {
    me = db.users.get("a1")
    go = requestAs(me)
  })

  test("can see all fields of themself", async () => {
    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${me.id}") { password }
      }`)
      let expectedUser = R.pick(["password"], me)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    return case1()
  })

  test("can see all fields of an admin", async () => {
    let admin = db.users.get("a2")

    async function case1() {
      let {data, errors} = await go(`query {
        user(id: "${admin.id}") { password }
      }`)
      let expectedUser = R.pick(["password"], me)
      expect(errors).toEqual([])
      expect(data.user).toEqual(expectedUser)
    }

    return case1()
  })
})
