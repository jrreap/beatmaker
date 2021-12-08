import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function readAllBeats (callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onSnapshot(collection(db, 'beats'), (querySnapshot) => {
        const beats = []
        querySnapshot.forEach((doc) => {
          beats.push(doc.data())
        })
        callback({ success: true, data: beats })
      })
    } else {
      callback({ success: false, data: 'Cannot Access Users Beats' })
    }
  })
}

function readUsersBeats (callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      onSnapshot(doc(db, 'users', userID), (doc) => {
        callback({ success: true, data: doc.data() })
      })
    } else {
      callback({ success: false, data: 'Cannot Access Users Beats' })
    }
  })
}

function readBeat (beatID, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getDoc(doc(db, 'users', user.uid, 'beats', beatID))
        .then((doc) => {
          callback({ success: true, data: doc.data() })
        })
        .catch(err => {
          console.error(err)
          callback({ success: false, data: err.message })
        })
    } else {
      callback({ success: false, data: 'Cannot Access Users Beats' })
    }
  })
}

function writeNewBeats (Author, Title, Genre, Description, Beat, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      const beatRefrence = doc(collection(db, 'beats'))
      const newBeatId = beatRefrence.id
      setDoc(beatRefrence, {
        beatId: newBeatId,
        Author: Author,
        Title: Title,
        Genre: Genre,
        Description: Description,
        Beat: Beat
      })
      setDoc(doc(db, 'users', userID, 'beats', newBeatId), {
        beatId: newBeatId,
        Author: Author,
        Title: Title,
        Genre: Genre,
        Description: Description,
        Beat: Beat
      })
      callback({ success: true, data: newBeatId })
    } else {
      callback({ success: false, data: 'Beat was not Uploaded' })
    }
  })
}

function updateBeat (Author, Title, Genre, Description, Beat, BeatId, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {

  })
}

export { readUsersBeats, readAllBeats, writeNewBeats, readBeat, updateBeat }
