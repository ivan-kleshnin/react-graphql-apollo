let HTTP = require("http")
let CookieSession = require("cookie-session")
let Cors = require("cors")
let BodyParser = require("body-parser")
let CookieParser = require("cookie-parser")
let Express = require("express")
let Path = require("path")
let Passport = require("passport")
let {ApolloServer} = require("apollo-server-express")
let db = require("./db")
let schema = require("./schema")
let resolvers = require("./resolvers")
let authRouter = require("./auth")

let PORT = 9000

let app = Express()

app.use("/public", Express.static(Path.resolve(__dirname, "../public")))
app.use(Cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}))
app.use(BodyParser.urlencoded({extended: true}))
app.use(BodyParser.json({}))

app.use(CookieParser())
app.use(CookieSession({
  name: "session",
  secret: "xxx",
  // Cookie options
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  signed: true,
}))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)
  console.log("body:", req.body)
  // console.log("req.session:", req.session)
  next()
})

app.use(Passport.initialize())
app.use(Passport.session())
app.use(authRouter)

let server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context({req}) {
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

// Cookie: session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiQkpycC1EdWRHIn19; session.sig=xcGdw0pPxVXVYMdxHofx-HwYJAk
//         session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiQkpycC1EdWRHIn19; session.sig=MPaLnWmqvJO4fuTuv3mgx2WZZms
