let visitor = [
  "query.*.job.*",
  "query.*.company.*",
  "query.*.talent.id",
  "query.*.talent.fullname",
]

let talent = [
  ...visitor,
  "query.self.talent.*",
]

let manager = [
  ...visitor,
  "query.self.manager.*",
  "query.*.talent.email",
  "create.job",
]

let admin = [
  "*"
]

module.exports = {
  visitor,
  talent,
  manager,
  admin,
}
