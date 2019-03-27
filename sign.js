// INPUTS
let data = {passport: {user: "ry9pbwdOz"}}
let secret = "xxx"

// SIGNING
let Keygrip = require("keygrip")

// Evaluating `session`
let dataStr = JSON.stringify(data)
let sessionPayload = Buffer.from(dataStr).toString("base64")
console.log("session=" + sessionPayload)

// Evaluating `session.sig`
keys = new Keygrip([secret])
let signaturePayload = keys.sign("session=" + sessionPayload)
console.log("session.sig=" + signaturePayload)

// Final cookie
console.log("cookie:" , "session=" + sessionPayload + "; " + "session.sig=" + signaturePayload)

// BJrp-DudG
// ->
// session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoiQkpycC1EdWRHIn19; session.sig=MPaLnWmqvJO4fuTuv3mgx2WZZms

// ry9pbwdOz
// ->
// session=eyJwYXNzcG9ydCI6eyJ1c2VyIjoicnk5cGJ3ZE96In19; session.sig=Sk_FgWBrNcuCBZoYLt0ym_VLdck
