import { getFirestore, doc, setDoc, onSnapshot, addDoc, collection } from 'firebase/firestore'
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

function writeBeats (Author, Title, Genre, Description, Beat, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      addDoc(collection(db, 'users', userID, 'beats'), {
        Author: Author,
        Title: Title,
        Genre: Genre,
        Description: Description,
        Beat: Beat
      })
      addDoc(collection(db, 'beats'), {
        Author: Author,
        Title: Title,
        Genre: Genre,
        Description: Description,
        Beat: Beat
      })
      callback({ success: true })
    } else {
      callback({ success: false, data: 'Beat was not Uploaded' })
    }
  })
}

export { readUsersBeats, readAllBeats, writeBeats }
