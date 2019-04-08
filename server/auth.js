let BodyParser = require("body-parser")
let {Router} = require("express")
let JWT = require("jsonwebtoken")
let Passport = require("passport")
let {Strategy: LocalStrategy} = require("passport-local")
let {Strategy: JwtStrategy, ExtractJwt} = require("passport-jwt")
// let {makeUser} = require("../common/models")
let db = require("./db")

let localOpts = {
  usernameField: "email",
  passwordField: "password",
}

Passport.use("local", new LocalStrategy(localOpts, async (email, password, done) => {
  // console.log("@ [local] verify")
  let user = db.users.list().find(user => {
    return user.email == email && user.password== password
  }) || null
  return done(null, user) // use 3rd argument to pass extra info like `{message: 'Incorrect password'}`
}))

let jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
}

Passport.use("jwt", new JwtStrategy(jwtOpts, async (payload, next) => {
  // console.log("@ [jwt] verify")
  // console.log("payload:", payload)
  let user = db.users.get(payload.user.id)
  next(null, user) // use 3rd argument to pass extra info like `{message: 'Incorrect password'}`
}))

// Passport.serializeUser((user, next) => {
//   console.log("@ serializeUser")
//   next(null, user.id)
// })
//
// Passport.deserializeUser((id, next) => {
//   console.log("@ deserializeUser")
//   let user = db.users.get(id)
//   console.log("user:", user)
//   if (user) next(null, user)
//   else      next(new Error(`Invalid user id ${id}`))
// })

let router = Router({
  // caseSensitive: true,
  // strict: true,
  // ??? TODO
})

// let authenticate = passport.authenticate("jwt", {session: false})

router.post("/login",
  BodyParser.json(),
  async (req, res, next) => {
    // console.log("@ [local] login preVerify")
    Passport.authenticate("local", {session: false}, async (err, user, info) => {
      // console.log("@ [local] login postVerify")
      console.log("err:", err)
      console.log("user:", user)
      console.log("info:", info)
      if (err) return next(err)
      if (!user) {
        res.status(401)
        return res.json({message: "Wrong credentials"})
      }
      req.login(user, {session: false}, async (error) => {
        if (err) return next(err)
        let body = {id: user.id}
        let token = JWT.sign({user: body}, jwtOpts.secretOrKey, {
          expiresIn: "30m"
        })
        return res.json({...user, token})
      })
    })(req, res, next)
  }
)

// -- no need
// router.post("/logout", async (req, res) => {
//   console.log("@ logout")
//   req.logout()
//   res.status(200)
//   res.json({me: null})
// })

// router.post("/register", (req, res, next) => {
//   // TODO validation
//   console.log("@ signUp")
//   let user = makeUser({
//     displayName: req.body.displayName, // Important: pick fields
//     email: req.body.email,             // one by one here
//     password: req.body.password,       // to avoid injections
//     provider: "local",
//     role: "contributor",
//   })
//   if (db.users[user.id]) {
//     res.status(409)
//     return res.json({message: "Duplicate id"})
//   }
//   if (findByEmail(user.email, db.users)) {
//     res.status(409)
//     return res.json({message: "Duplicate email"})
//   }
//   // TODO duplicate by `displayName`?! or add unique `username` ?!
//   db.users[user.id] = user
//   let json = JSON.stringify(db.users, null, 2)
//   FS.writeFile("./db/users.json", json, "utf-8", (err) => {
//     if (err) next(err)
//     res.status(200)
//     res.json(user)
//   })
// })

let authenticate = (req, res, next) => {
  // console.log("@ pre auth")
  Passport.authenticate("jwt", {session: false}, (err, user, info) => {
    // console.log("err:", err)
    // console.log("user:", user)
    // console.log("info:", info) // TODO handle `err` and `info` properly
    // console.log("@ post auth")
    req.user = user || null
    next()
  })(req, res, next)
}

exports.router = router
exports.authenticate = authenticate

// bcrypt: for hashing user passwords
// jsonwebtoken: for signing tokens
// passport-local: package for implementing local strategy
// passport-jwt: middleware for getting and verifying JWT's

// Here's how our application is going to work:

// The user signs up and then logs in, after the user logs in, a JSON web token would be given to the user.
// The user is expected to store this token locally.
// This token is to be sent by the user when trying to access certain secure routes,
// once the token has been verified, the user is then allowed to access the route.
// Now Let's get to coding.
