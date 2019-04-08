require("dotenv").config()
let app = require("./app")

let PORT = 9000

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
})
