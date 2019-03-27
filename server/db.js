let {DataStore} = require("notarealdb")

let store = new DataStore("./data")

module.exports = {
  companies: store.collection("companies"),
  jobs: store.collection("jobs"),
  users: store.collection("users")
}
