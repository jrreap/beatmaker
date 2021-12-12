import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import { createNewUser, signInUser, sessionAuth, signOutUser, authMiddleware } from './firebase/fire-auth.js'
import { writeNewBeats, readUsersBeats, readAllBeats, readBeat, updateBeat, deleteBeat } from './firebase/fire-beats.js'
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
  const sessionUID = req.headers.uid
  sessionAuth(sessionUID, (result) => {
    if (result.isLogedIn) {
      res.status(200).json({ uid: result.userId })
    } else {
      res.status(203).send(result.error)
    }
  })
})

app.post('/createNewAccount', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name
  createNewUser(email, password, name, (result) => {
    if (result.success) {
      res.status(200).send(result.userId)
    } else {
      res.status(203).send(result.error)
    }
  })
})

app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  signInUser(email, password, (result) => {
    if (result.success) {
      res.status(200).json({ uid: result.userId })
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

/// ////////////////////
// Firebase Fire Store
/// ///////////////////

app.use(authMiddleware)

app.post('/writeNewBeat', (req, res) => {
  const Author = req.body.Author
  const Title = req.body.Title
  const Genre = req.body.Genre
  const Description = req.body.Description
  const Beat = req.body.Beat
  const saveToCatalog = req.body.saveToCatalog
  const uid = req.uid

  writeNewBeats(uid, Author, Title, Genre, Description, Beat, saveToCatalog, (result) => {
    if (result.success) {
      res.status(200).send({ data: result.data })
    } else {
      res.status(203).send('Could Not Update Beats')
    }
  })
})

app.put('/updateBeat', (req, res) => {
  const Author = req.body.Author
  const Title = req.body.Title
  const Genre = req.body.Genre
  const Description = req.body.Description
  const Beat = req.body.Beat
  const BeatID = req.body.BeatID
  const uid = req.uid

  updateBeat(uid, Author, Title, Genre, Description, Beat, BeatID, (result) => {
    if (result.success) {
      res.status(200).json({ data: result.data })
    } else {
      res.status(203).send('Could Not Update Beats')
    }
  })
})

app.get('/readBeat', (req, res) => {
  const beatId = req.query.id
  const uid = req.uid
  let catalog = req.query.catalog

  if (!catalog) {
    catalog = false
  }

  readBeat(uid, beatId, catalog, (result) => {
    if (result.success) {
      res.status(200).json({ data: result.data })
    } else {
      res.status(203).send('Could Not Read Beat')
    }
  })
})

app.get('/readUserInfo', (req, res) => {
  readUsersBeats(req.uid, (result) => {
    if (result.success) {
      res.status(200).json({ data: result.data })
    } else {
      res.status(203).send(result.data)
    }
  })
})

app.get('/getAllBeats', (req, res) => {
  readAllBeats((result) => {
    if (result.success) {
      res.status(200).send(result.data)
    } else {
      res.status(203).send([])
    }
  })
})

app.delete('/deleteBeat', (req, res) => {
  const beatId = req.body.beatId
  const uid = req.uid
  deleteBeat(uid, beatId, (result) => {
    if (result.success) {
      res.status(200).send('Success')
    } else {
      res.status(203).send([])
    }
  })
})
