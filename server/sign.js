let R = require("ramda")
let JWT = require("jsonwebtoken")
let db = require("./db")

async function sign(id, secret) {
  let jwtOpts = {
    secretOrKey: secret,
  }
  let user = db.users.get(id)
  if (!user) {
    throw Error("user not found")
  }
  let userData = R.pick(["id", "role"], user)
  let token = JWT.sign({user: userData}, jwtOpts.secretOrKey, {
    expiresIn: "900m"
  })
  return token
}

module.exports = sign

if (require.main === module) {
  ;(async() => {
    let userId = process.argv[2]
    let token = await sign(userId, "secret") // TODO env?!
    console.log(token)
    console.log()
    console.log(`Authorization: bearer ${token}`)
    console.log()
    console.log(`"Authorization": "bearer ${token}"`)
  })()
}
