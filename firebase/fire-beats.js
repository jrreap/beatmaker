import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function readAllBeats(callback) {
  const db = getFirestore()

  getDocs(collection(db, 'beats'))
    .then(docs => {
      const beats = []
      docs.forEach((doc) => {
        beats.push(doc.data())
      });
      callback({ success: true, data: beats })
    })
    .catch(err => {
      console.error(err)
      callback({ success: false, data: err.message })
    })
}


function readUsersBeats(uid, callback) {
  const db = getFirestore()
  getDocs(collection(db, "users", uid, "beats"))
    .then(docs => {
      const beats = []
      docs.forEach((doc) => {
        beats.push(doc.data())
      });
      callback({ success: true, data: beats })
    })
    .catch(err => {
      console.error(err)
      callback({ success: false, data: err.message })
    })
}


function readUsersInfo(uid, callback) {
  const db = getFirestore()
  getDoc(doc(db, 'users', uid))
    .then(docs => {
      const data = docs.data()
      callback({ success: true, data })
    })
    .catch(err => {
      console.error(err)
      callback({ success: false, data: err.message })
    })
}

function readBeat(uid, beatID, catalog, callback) {
  const db = getFirestore()
  // Pull from the user beat if this isn't from the catalog
  if (!catalog) {
    getDoc(doc(db, 'users', uid, 'beats', beatID))
      .then((doc) => {
        callback({ success: true, data: doc.data() })
      })
      .catch(err => {
        console.error(err)
        callback({ success: false, data: err.message })
      })
  } else {
    getDoc(doc(db, 'beats', beatID))
      .then((doc) => {
        callback({ success: true, data: doc.data() })
      })
      .catch(err => {
        console.error(err)
        callback({ success: false, data: err.message })
      })
  }
}

async function writeNewBeats(uid, Author, Title, Genre, Description, Beat, saveToCatalog, callback) {
  const db = getFirestore()
  const beatReference = doc(collection(db, 'beats'))
  const newBeatId = beatReference.id

  try {
    await setDoc(beatReference, {
      beatId: newBeatId,
      Author: Author,
      Title: Title,
      Genre: Genre,
      Description: Description,
      Beat: Beat
    })
    await setDoc(doc(db, 'users', uid, 'beats', newBeatId), {
      beatId: newBeatId,
      Author: Author,
      Title: Title,
      Genre: Genre,
      Description: Description,
      Beat: Beat
    })
    callback({ success: true, data: newBeatId })
  } catch (err) {
    console.error(err)
    callback({ success: false, data: err.message })
  }
}

/**
 * Updates an exisiting beat to the database
 *
 *
 * @param {String} Author: The author of the beat
 * @param {string} Title: The title of the beat
 * @param {string} Genre: The Genre of the beat
 * @param {string} Description: The description of the beat
 * @param {string} BeatId: The unique ID for the beat you want to update
 * @param {JSON} Beat: The JSON object that contains the beat matric
 * @param {function} callback: Call back function that returns the beat id on success

 */
async function updateBeat(uid, Author, Title, Genre, Description, Beat, BeatId, callback) {
  const db = getFirestore()
  try {
    await setDoc(doc(db, 'beats', BeatId), {
      beatId: BeatId,
      Author: Author,
      Title: Title,
      Genre: Genre,
      Description: Description,
      Beat: Beat
    })
    await setDoc(doc(db, 'users', uid, 'beats', BeatId), {
      beatId: BeatId,
      Author: Author,
      Title: Title,
      Genre: Genre,
      Description: Description,
      Beat: Beat
    })
    callback({ success: true, data: BeatId })
  } catch (err) {
    console.error(err)
    callback({ success: false, data: err.message })
  }
}

async function deleteBeat(uid, beatId, callback) {
  const db = getFirestore()
  try {
    await deleteDoc(doc(db, 'beats', beatId))
    await deleteDoc(doc(db, 'users', uid, 'beats', beatId))
    callback({ success: true, data: 'Success' })
  } catch (err) {
    console.error(err)
    callback({ success: false, data: 'Beat was not deleted' })
  }
}

export { readUsersInfo, readAllBeats, writeNewBeats, readBeat, updateBeat, deleteBeat, readUsersBeats }
