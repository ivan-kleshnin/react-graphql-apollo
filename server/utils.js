let delay = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

exports.delay = delay
