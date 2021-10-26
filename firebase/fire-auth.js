import e from "express";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import firebaseConfig from './fire-app.js'


function createNewUser(res, email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = userCredential.user.getIdToken()
            res.status(200).send(userId)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(203).send(errorMessage)
        });
}

function signInUser(res, email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = userCredential.user.uid
            console.log("Hey landed Here")
            res.status(200).send(userId)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error)
            res.status(203).send("Sending HEre" + errorMessage)
        });
}

export { createNewUser, signInUser }