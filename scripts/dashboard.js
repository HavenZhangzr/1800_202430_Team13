function displayJobPostingsDynamically(collection, assessmentIDs) {
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
        displayJobPostingsDynamically("assessments", assessmentIDs); // Input param is the name of the collection and the array of assessment IDs
    })
    .catch(error => {
        console.log("Error getting documents: ", error);
    });

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userID = user.uid;
        displayCardsDynamically("assessments", userID);
    }
});

// Loops through each job posting and finds this UIDs applications
function getApplicationsForJob(UID) {
    var applications = [];

    // Get the job postings (called assessments in firestore) and loop through them, in each assessment, theres a sub-collection called applications. the name of the applications are the UID
    db.collection("assessments").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var applicationsRef
            applicationsRef = db.collection("assessments").doc(doc.id).collection("applications").doc(UID);
            applicationsRef.get().then((doc) => {
                if (doc.exists) {
                    applications.push(doc.data());
                }
            })
        })
    })

    return applications;
}

function displayCardsDynamically(collection, userID) {
    let cardTemplate = document.getElementById("applicationTemplate"); // Retrieve the HTML element with the ID "assessmentTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "assessments"
        .then(allAssessments => {
            const promises = [];
            allAssessments.forEach(doc => { //iterate thru each doc
                // itterate through each "responses" subcollection
                const promise = db.collection("assessments").doc(doc.id).collection("responses")
                    .orderBy("timestamp", "desc") // Order by timestamp
                    .get().then((querySnapshot) => {
                        return querySnapshot.docs.filter(responseDoc => responseDoc.id == userID).map(responseDoc => {
                            return {
                                application: responseDoc.data(),
                                jobPosting: doc.data(),
                                docID: doc.id
                            };
                        });
                    });
                promises.push(promise);
            });

            Promise.all(promises).then(results => {
                const applications = results.flat().sort((a, b) => b.application.timestamp.toDate() - a.application.timestamp.toDate()).slice(0, 3);
                applications.forEach(({ application, jobPosting, docID }) => {
                    var title = jobPosting.role; // Accessing the parent document's data
                    var details = "<b>Company:</b> " + jobPosting.company + "<br><b>Role:</b> " + jobPosting.role + "<br><b>Team:</b> " + jobPosting.team + "<br><b>Description:</b> " + jobPosting.description;
                    var resumeLink = application.resumeLink;

                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-details').innerHTML = details;
                    newcard.querySelector('a').href = resumeLink;

                    //change the questionscollapse id to be unique
                    newcard.querySelector('.collapse').id = "questionsCollapse" + docID;

                    // udpate the open question dropdown button to be unique
                    newcard.querySelector('.view-questions-button').setAttribute("data-bs-target", "#questionsCollapse" + docID);

                    // Fetch and display questions and answers
                    const questionsList = newcard.querySelector('.questions-list');
                    db.collection('assessments').doc(docID).collection('questions').get().then(questionsSnapshot => {
                        questionsSnapshot.forEach(questionDoc => {
                            const questionData = questionDoc.data();
                            const questionID = questionDoc.id;
                            const userAnswer = application.multipleChoiceAnswers[questionID] || application.shortAnswerAnswers[questionID];

                            const questionItem = document.createElement('li');
                            questionItem.classList.add('list-group-item');
                            questionItem.innerHTML = `
                                <strong>Question:</strong> ${questionData.question}<br>
                                <strong>Your Answer:</strong> ${userAnswer}<br>
                            `;
                            questionsList.appendChild(questionItem);
                        });
                    });

                    document.getElementById("assessmentList").appendChild(newcard);
                });
            });
        });
}


