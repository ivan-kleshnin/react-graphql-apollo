let basicAuth = require("basic-auth")
let cuid = require("cuid")
let db = require("../db")

let newApiKey = cuid

let authenticate = async function (req, ctx) {
  let credentials = basicAuth(req) // req.headers.authorization

  // TODO or credentials are invalid
  if (!credentials) {
    // Unauthorized
    return ctx // no `ctx.user`
  }

  let {name: email, pass: password} = credentials

  let user = db.users.list().find(user => {
    return user.email == email && user.password == password
  })

  // adds `ctx.user`
  return {...ctx, user}
}

module.exports = {
  newApiKey,
  authenticate,
}
