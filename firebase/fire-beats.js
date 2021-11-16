import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth";

function readAllBeats(res) {
    const db = getFirestore();
    const auth = getAuth();
}


function readBeats(res) {
    const db = getFirestore();
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userID = user.uid;
            console.log(userID)
            const unsub = onSnapshot(doc(db, "users", userID), (doc) => {
                console.log("Current data: ", doc.data());
                // res.status(200).send(doc.data())
            });
            console.log(unsub)

        } else {
            res.status(203).send("Cannot Access Users Beats")
        }
    });
    // const unsub = onSnapshot(doc(db, "users", "SF"), (doc) => {
    //     console.log("Current data: ", doc.data());
    // });


}

function writeBeats() {
    const db = getFirestore();

}

export { readBeats, writeBeats }