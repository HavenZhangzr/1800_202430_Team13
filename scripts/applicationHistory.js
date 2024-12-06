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
    let cardTemplate = document.getElementById("assessmentTemplate"); // Retrieve the HTML element with the ID "assessmentTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "assessments"
        .then(allAssessments => {
            allAssessments.forEach(doc => { //iterate thru each doc
                // itterate through each "responses" subcollection
                db.collection("assessments").doc(doc.id).collection("responses").get().then((querySnapshot) => {
                    querySnapshot.forEach((responseDoc) => {
                        // if the name of the doc is the userID, then it's the user's application
                        if (responseDoc.id == userID) {
                            // display the application
                            var application = responseDoc.data();
                            var jobPosting = doc.data();
                            var title = jobPosting.role; // Accessing the parent document's data
                            var details = "<b>Company:</b> " + jobPosting.company + "<br><b>Role:</b> " + jobPosting.role + "<br><b>Team:</b> " + jobPosting.team + "<br><b>Description:</b> " + jobPosting.description;
                            var resumeLink = application.resumeLink;
                            let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                            //update title and text and image
                            newcard.querySelector('.card-title').innerHTML = title;
                            newcard.querySelector('.card-details').innerHTML = details;
                            newcard.querySelector('a').href = resumeLink;

                            //change the questionscollapse id to be unique
                            newcard.querySelector('.collapse').id = "questionsCollapse" + doc.id;

                            // udpate the open question dropdown button to be unique
                            newcard.querySelector('.view-questions-button').setAttribute("data-bs-target", "#questionsCollapse" + doc.id);

                            // Fetch and display questions and answers
                            const questionsList = newcard.querySelector('.questions-list');
                            db.collection('assessments').doc(doc.id).collection('questions').get().then(questionsSnapshot => {
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
                        }
                    });
                });
            });
        });
}