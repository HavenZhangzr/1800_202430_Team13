// this script redirects job-seeker accounts away from recruiter-only pages

// get account type from firestore

function checkIfRecruiter() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // firebase users/[UID] isRecruiter
            const userRef = db.collection("users").doc(user.uid);
            userRef.get().then(function (doc) {
                if (doc.exists) {
                    if (doc.data().isRecruiter === false) {
                        console.log("User is not a recruiter.");
                        window.location.href = "dashboard.html";
                    }
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
            

        }

        
    });
}

// check if user is a recruiter
checkIfRecruiter();

console.log("Recruiter-only script loaded successfully.");



