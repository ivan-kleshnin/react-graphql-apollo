let express = require("express")
let {ApolloServer} = require("apollo-server")
let typeDefs = require("./schema")
let resolvers = require("./resolvers")
let {authenticate} = require("./utils/auth")
let db = require("./db")

let port = 9000

let server = new ApolloServer({
  typeDefs,
  resolvers,
  async context({req}) {
    //   console.log("@ context")
    let ctx = {db}
    ctx = await authenticate(req, ctx)
    // console.log("ctx =", ctx)
    return ctx
  }
  // Note: we can set JWT in cookie via `formatResponse`
})

server.listen(port).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
//   console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)

// app.listen(port, () => console.info(`Server started on port ${port}`))

// let bodyParser = require("body-parser")
// let cors = require("cors")
// let express = require("express")
// let expressJwt = require("express-jwt")
// let jwt = require("jsonwebtoken")
// let db = require("./db")
//
// let port = 9000
// let jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64")
//
// let app = express()
// app.use(cors(), bodyParser.json(), expressJwt({
//   secret: jwtSecret,
//   credentialsRequired: false
// }))
//
// app.post("/login", (req, res) => {
//   let {email, password} = req.body
//   let user = db.users.list().find((user) => user.email === email)
//   if (!(user && user.password === password)) {
//     res.sendStatus(401)
//     return
//   }
//   let token = jwt.sign({sub: user.id}, jwtSecret)
//   res.send({token})
// });
//
//
//
//
