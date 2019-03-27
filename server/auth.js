let {Router} = require("express")
let Passport = require("passport")
let {Strategy: LocalStrategy} = require("passport-local")
// let {makeUser} = require("../common/models")
let db = require("./db")

Passport.use("local", new LocalStrategy({
    usernameField: "email",
  },
  (email, password, next) => {
    console.log("@ authenticate")
    let user = db.users.list().find(user => {
      return user.email == email && user.password == password
    }) || null
    console.log("user !!!:", user)
    next(null, user) // use 3rd argument to pass extra info like `{message: 'Incorrect password'}`
  }
))

Passport.serializeUser((user, next) => {
  console.log("@ serializeUser")
  next(null, user.id)
})

Passport.deserializeUser((id, next) => {
  console.log("@ deserializeUser")
  let user = db.users.get(id)
  console.log("user:", user)
  if (user) next(null, user)
  else      next(new Error(`Invalid user id ${id}`))
})

let router = Router({
  // caseSensitive: true,
  // strict: true,
  // ??? TODO
})

router.post("/signin", (req, res, next) => {
  console.log("@ signIn")
  // TODO validation
  Passport.authenticate("local", (err, user, info) => {
    console.log("@ signIn 2")
    console.log("err:", err)
    console.log("user:", user)
    console.log("info:", info)
    if (err) return next(err)
    if (!user) {
      res.status(401)
      return res.json({message: "Wrong credentials"})
    }
    req.logIn(user, (err) => { // sets `req.user` to `user`
      if (err) return next(err)
      console.log("@ authorized")
      res.status(200)
      return res.json(user)
    })
  })(req, res, next)
})

// router.post("/signup", (req, res, next) => {
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

// router.post("/signout", (req, res) => {
//   console.log("@ signOut")
//   req.logout()
//   res.status(200)
//   res.json({me: null})
// })

module.exports = router
