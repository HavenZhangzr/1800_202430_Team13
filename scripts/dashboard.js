function displayCardsDynamically(collection, assessmentIDs) {
    let cardTemplate = document.getElementById("postingTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    assessmentIDs.forEach(assessmentID => {
        db.collection(collection).doc(assessmentID).get() // Get the specific document by ID
            .then(doc => {
                if (doc.exists) {
                    var assessmentDocID = doc.id;
                    var title = doc.data().role;
                    var description = doc.data().description;
                    var details = moment(doc.data().timestamp.toDate()).fromNow(); // Convert Firestore timestamp to Date and format it

                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    // Update title and text and image
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-text').innerHTML = description;
                    newcard.querySelector('.card-text-small').innerHTML = details;
                    newcard.querySelector('a').href = "jobApply.html?docID=" + assessmentDocID + "&title=" + title;

                    // Attach to gallery, Example: "hikes-go-here"
                    document.getElementById("featuredJobs").appendChild(newcard);
                } else {
                    console.log("No such document!");
                }
            })
            .catch(error => {
                console.log("Error getting document:", error);
            });
    });
}

// Fetch the 3 newest assessment IDs
db.collection("assessments").orderBy("timestamp", "desc").limit(3).get()
    .then(querySnapshot => {
        const assessmentIDs = [];
        querySnapshot.forEach(doc => {
            assessmentIDs.push(doc.id);
        });
        displayCardsDynamically("assessments", assessmentIDs); // Input param is the name of the collection and the array of assessment IDs
    })
    .catch(error => {
        console.log("Error getting documents: ", error);
    });