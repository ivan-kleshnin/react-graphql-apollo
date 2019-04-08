require("dotenv").config()
let {ApolloServer, ForbiddenError, AuthenticationError} = require("apollo-server-express")
let Cors = require("cors")
let Express = require("express")
let FS = require("fs")
let getFields = require("graphql-fields")
let HTTP = require("http")
let Passport = require("passport")
let {checkPermission} = require("permissionary")
let Path = require("path")
let db = require("./db")
let resolvers = require("./resolvers")
let {router: authRouter, authenticate} = require("./auth")
let permissions = require("./permissions")

schema = FS.readFileSync("./schema.graphql", {encoding: "utf-8"})

let allowed = checkPermission(permissions)

let app = Express()

app.use(Cors())
// app.use(Cors({ -- no need
//   origin: "http://localhost:3000",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true,
// }))
// app.use(CookieParser()) -- no need
// app.use(CookieSession({ -- no need
//   name: "session",
//   secret: "xxx",
//   // Cookie options
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   httpOnly: true,
//   signed: true,
// }))

// Log all requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.originalUrl}`)
//   console.log("body:", req.body)
//   next()
// })

app.use(Passport.initialize())
// app.use(Passport.session()) -- no need
app.use(authRouter)
app.use(authenticate)

app.get("/200", (req, res) => {
  res.status(200)
  res.json({message: "Ok"})
})

app.get("/404", (req, res) => {
  res.status(404)
  res.json({message: "Not Found"})
})

let apolloApp = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context({req}) {
    // console.log("@ ApolloServer.context")

    let ctx = {
      me: req.user || {role: "visitor"},
      db: db,
    }

    let authorize = (permissionPrefix, info) => {
      let me = ctx.me

      if (info) {
        let fields = Object.keys(getFields(info))
        for (let field of fields) {
          let permission = `${permissionPrefix}.${field}`
          if (!allowed([me.role], permission)) {
            if (me.role == "visitor") throw new AuthenticationError("Not authenticated")
            else                      throw new ForbiddenError(`Not allowed to ${permission}`)
          }
        }
      } else {
        let permission = permissionPrefix
        if (!allowed([me.role], permission)) {
          if (me.role == "visitor") throw new AuthenticationError("Not authenticated")
          else                      throw new ForbiddenError(`Not allowed to ${permission}`)
        }
      }
    }

    ctx.authorize = authorize

    return ctx
  },
  playground: {
    settings: {
      "request.credentials": "include"
    }
  }
})

apolloApp.applyMiddleware({app, path: "/graphql"})

// 404 handler
app.use((req, res, next) => {
  res.status(404)
  res.json({message: HTTP.STATUS_CODES[404]})
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // Log 5xx errors
  res.status(500)
  res.json({message: HTTP.STATUS_CODES[500]})
})

module.exports = app
