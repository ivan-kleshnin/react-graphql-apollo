let {DataStore} = require("notarealdb")

// console.log("process.env.DATA_DIR:", process.env.DATA_DIR)

let store = new DataStore(process.env.DATA_DIR)

module.exports = {
  companies: store.collection("companies"),
  jobs: store.collection("jobs"),
  users: store.collection("users"),
  applications: store.collection("applications"),
}
