import e from "express";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"



function createNewUser(res, email, password) {
    const auth = getAuth();
    const db = getFirestore();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid
            setDoc(doc(db, "users", userId), {
                email: email,
                beats: []
            });
            res.status(200).send(userId)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(203).send(errorMessage)
        });
}

function signInUser(email, password, callback) {
    const auth = getAuth();
    let returnValue = []
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid
            callback({ "success": true, "userId": userId })
        })
        .catch((error) => {
            const errorCode = error.code;
            callback({ "success": false, "error": "Incorrect Login" })

        });
}

function sessionAuth(res, uid) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userID = user.uid;
            if (uid == userID) {
                res.status(200).send(true)
            } else {
                res.status(203).send(false)
            }
        } else {
            res.status(203).send(false)
        }
    });

}

function signOutUser(res) {
    const auth = getAuth();
    signOut(auth).then(() => {
        res.status(200).send("Logged Out")
    }).catch((error) => {
        res.status(500).send(error)
    });
}

export { createNewUser, signInUser, sessionAuth, signOutUser }