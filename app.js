const express = require('express')
const path = require('path')
const app = express()
const port = 8080

app.use(function (req, res, next) {
  const { url, path: routePath } = req
  console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').')
  next()
})

app.use('/', express.static(path.join(__dirname, '')))

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
