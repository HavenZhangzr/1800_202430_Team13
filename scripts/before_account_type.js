/*
 * This script is used to update the isRecruiter field in the user's document in the Firestore database.
 * A user cannot change their account type after they have created their account.
 */

function updateIsRecruiter(isRecruiter) {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);

                userRef.get().then(doc => {
                    if (doc.exists) {
                        if (doc.data().isRecruiter != null) {
                            console.log("isRecruiter field already exists.");
                            reject("isRecruiter field already exists.");
                            return;
                        }
                    }


                    userRef.update({
                        isRecruiter: isRecruiter
                    }).then(() => {
                        console.log("isRecruiter field updated successfully.");
                        resolve();
                    }).catch(error => {
                        console.error("Error updating isRecruiter field: ", error);
                        reject(error);
                    });   
                });

            } else {
                console.log("No user is logged in.");
                reject("No user is logged in.");
            }
        });
    });
}



document.getElementById("jobSeekerBtn").addEventListener("click", function() {
    updateIsRecruiter(false).then(() => {
        window.location.href = "dashboard.html";
    });
});

document.getElementById("recruiterBtn").addEventListener("click", function() {
    updateIsRecruiter(true).then(() => {
        window.location.href = "recruiterdashboard.html";
    });
});