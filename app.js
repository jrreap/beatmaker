import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { createNewUser, signInUser, sessionAuth, signOutUser } from './firebase/fire-auth.js'
import { readBeats } from './firebase/fire-beats.js'
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase/fire-app.js'
import e from 'express';

const app = express()
const port = 8080
let fireApp = initializeApp(firebaseConfig)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
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

///////////////////
// Firebase Auth
//////////////////
app.post('/authenticateRoute', (req, res) => {
  let sessionUID = req.body.uid
  sessionAuth(sessionUID, (result) => {
    if (result.isLogedIn) {
      res.status(200).send(result.userId)
    } else {
      res.status(203).send(result.error)
    }
  })
})

app.post('/createNewAccount', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  createNewUser(email, password, (result) => {
    if (result.success) {
      res.status(200).send(result.userId)
    } else {
      res.status(203).send(result.error)
    }
  })
})

app.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  signInUser(email, password, (result) => {
    if (result.success) {
      res.status(200).send(result.userId)
    } else {
      res.status(203).send(result.error)
    }
  })
})


app.post('/signOut', (req, res) => {
  signOutUser((result) => {
    if (result.success) {
      res.status(200).send(result.message)
    } else {
      res.status(500).send(result.error)
    }
  })
})

app.get('/readUserInfo', (req, res) => {
  readBeats(res)
})



