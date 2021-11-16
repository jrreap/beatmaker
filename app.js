import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import { createNewUser, signInUser, sessionAuth, signOutUser } from './firebase/fire-auth.js'
import { initializeApp } from 'firebase/app'
import firebaseConfig from './firebase/fire-app.js'

const app = express()
const port = 8080
const fireApp = initializeApp(firebaseConfig)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  const { url, path: routePath } = req
  console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').')
  next()
})

app.use('/', express.static(join(__dirname, '')))

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})

/// ////////////////
// Firebase Auth
/// ///////////////
app.post('/authenticateRoute', (req, res) => {
  const sessionUID = req.body.uid
  sessionAuth(res, sessionUID)
})

app.post('/createNewAccount', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  createNewUser(res, email, password)
})

app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  signInUser(res, email, password)
})

app.post('/signOut', (req, res) => {
  signOutUser(res)
})
