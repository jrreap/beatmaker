import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"


function createNewUser(email, password, name, callback) {
    const auth = getAuth();
    const db = getFirestore();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid
            updateProfile(userCredential.user, { displayName: name })
            setDoc(doc(db, "users", userId), {
                email: email,
                name: name,
                beats: []
            });
            callback({ "success": true, "userId": userId })

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            callback({ "success": false, "error": "Could Not Create Account" })
        });
}

function signInUser(email, password, callback) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const uid = userCredential.user.uid
            const userData = { name: userCredential.user.displayName, email: userCredential.user.email }
            console.log(userData)
            callback({ "success": true, "userId": uid, "userData": userData })
        })
        .catch((error) => {
            const errorCode = error.code;
            callback({ "success": false, "error": "Incorrect Login" })

        });
}

function sessionAuth(uid, callback) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userID = user.uid;
            if (uid == userID) {
                callback({ "isLogedIn": true, "userId": userID })
            } else {
                callback({ "isLogedIn": false, "error": "Not Logged In" })
            }
        } else {
            callback({ "isLogedIn": false, "error": "Not Logged In" })
        }
    });

}

async function authMiddleware(req, res, next) {
    if (!req.headers.uid) {
        res.status(401).send('Not signed in')
    } else {
        req.uid = req.headers.uid
        next()
    }
}

function signOutUser(callback) {
    const auth = getAuth();
    signOut(auth).then(() => {
        callback({ "success": true, "message": "Logged Out" })
    }).catch((error) => {
        callback({ "success": false, "error": "Could Not Log Out" })
    });
}

export { createNewUser, signInUser, sessionAuth, signOutUser, authMiddleware }