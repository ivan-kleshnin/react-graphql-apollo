let {ApolloServer} = require("apollo-server-express")
let Cors = require("cors")
let Express = require("express")
let HTTP = require("http")
let Passport = require("passport")
let Path = require("path")
let db = require("./db")
let schema = require("./schema")
let resolvers = require("./resolvers")
let {router: authRouter, authenticate} = require("./auth")

let PORT = 9000

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

let server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context({req}) {
    console.log("@ ApolloServer.context")
    console.log("req.user:", req.user)
    let ctx = {
      user: req.user,
      db: db,
    }
    return ctx
  },
  playground: {
    settings: {
      "request.credentials": "include"
    }
  }
})

server.applyMiddleware({app, path: "/graphql"})

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

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
})
