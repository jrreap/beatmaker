import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { createNewUser } from './firebase/fire-auth.js'
import { signInUser } from './firebase/fire-auth.js'
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase/fire-app.js'

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

app.post('/createNewAccount', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  createNewUser(res, email, password)
})

app.post('/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  signInUser(res, email, password)
})

app.use('/', express.static(join(__dirname, '')))

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
