// Reference to the form
const form = document.getElementById('assessmentsubmission');
const questionsContainer = document.getElementById('questionsContainer');
const questionTemplate = document.getElementById('questionTemplate');

// Add event listener to the form
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capture values from the form fields
    const role = form.role ? form.role.value : '';
    const company = form.company ? form.company.value : '';
    const team = form.team ? form.team.value : '';
    const description = form.description ? form.description.value : '';
    const ends = form.ends ? form.ends.value : '';

    // Add data to Firestore
    db.collection("assessments").add({
        role: role,
        company: company,
        team: team,
        description: description,
        ends: ends
    }).then(docRef => {
        const assessmentId = docRef.id;
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, index) => {
            const questionText = question.querySelector('.question-text').value;
            const answerChoices = question.querySelectorAll('.answer-choice');
            const correctAnswers = question.querySelectorAll('.correct-answer');
            let answers = [];
            let correct = [];
            answerChoices.forEach((choice, i) => {
                answers.push(choice.value);
                if (correctAnswers[i].checked) {
                    correct.push(choice.value);
                }
            });
            db.collection("assessments").doc(assessmentId).collection("questions").add({
                question: questionText,
                answers: answers,
                correct: correct,
                questionType: "multiple-choice",
                isMultipleChoice: true
            });
        });

        // clear form fields
        form.reset();
        questionsContainer.innerHTML = '';

        alert("Assessment created successfully!");
    });



});

// Add event listener to the "Add Question" button
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const newQuestion = questionTemplate.content.cloneNode(true);
    questionsContainer.appendChild(newQuestion);
});


function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("assessmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called 
        .then(allAssessments => {
            // var i = 1;  //Optional: if you want to have a unique ID
            allAssessments.forEach(doc => { //iterate thru each doc
                var assessmentDocID = doc.id;
                var title = doc.data().role;
                var description = doc.data().description;
                var details = "<b>Company:</b> " + doc.data().company + "<br><b>Role:</b> " + doc.data().role + "<br><b>Team:</b> " + doc.data().team + "<br><b>Description:</b> " + doc.data().description;

                // var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-description').innerHTML = description;
                newcard.querySelector('.card-details').innerHTML = details;
                newcard.querySelector('a').href = "applicationView.html" + "?docID=" + assessmentDocID + "&title=" + title;

                // Add delete button functionality
                newcard.querySelector('.btn-delete').addEventListener('click', () => {
                    if (confirm("Are you sure you want to delete this assessment?")) {
                        db.collection("assessments").doc(assessmentDocID).delete().then(() => {
                            alert("Assessment deleted successfully!");
                            location.reload(); // Reload the page to reflect the changes
                        }).catch(error => {
                            console.error("Error deleting assessment: ", error);
                        });
                    }
                });

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("assessmentList").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("assessments")





// test function to create a couple job postings
function createPostings() {
    db.collection("assessments").add({
        role: "Software Engineer",
        company: "Google",
        team: "Search",
        description: "We are looking for a software engineer to join our Search team.",
        ends: "2021-12-31"
    }).then(docRef => {
        const assessmentId = docRef.id;
        db.collection("assessments").doc(assessmentId).collection("questions").add({
            question: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: ["Paris"],
            questionType: "multiple-choice",
            isMultipleChoice: true
        });
        db.collection("assessments").doc(assessmentId).collection("questions").add({
            question: "What is the capital of Germany?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: ["Berlin"],
            questionType: "multiple-choice",
            isMultipleChoice: true
        });
        db.collection("assessments").doc(assessmentId).collection("questions").add({
            question: "What is the capital of Spain?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: ["Madrid"],
            questionType: "multiple-choice",
            isMultipleChoice: true
        });
    });

    db.collection("assessments").add({
        role: "Product Manager",
        company: "Facebook",
        team: "Messenger",
        description: "We are looking for a product manager to join our Messenger team.",
        ends: "2021-12-31"
    }).then(docRef => {
        const assessmentId = docRef.id;
        db.collection("assessments").doc(assessmentId).collection("questions").add({
            question: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: ["Paris"],
            questionType: "multiple-choice",
            isMultipleChoice: true
        });
        db.collection("assessments").doc(assessmentId).collection("questions").add({
            question: "What is the capital of Germany?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correct: ["Berlin"],
            questionType: "multiple-choice",
            isMultipleChoice: true
        });

    });
}
