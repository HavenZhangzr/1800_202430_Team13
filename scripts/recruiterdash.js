// Reference to the form
const form = document.getElementById('assessmentsubmission');
const questionsContainer = document.getElementById('questionsContainer');
const questionTemplate = document.getElementById('questionTemplate');

// Create a default question field
questionsContainer.appendChild(questionTemplate.content.cloneNode(true));
// Attach delete button listener to the default question
const defaultDeleteButton = questionsContainer.lastElementChild.querySelector('.delete-question-btn');
if (defaultDeleteButton) {
    attachDeleteListener(defaultDeleteButton);
}
// checkIfDeleteShouldBeDisabled();

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
        ends: ends,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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

        // Use SweetAlert to show success message
        Swal.fire({
            title: 'Success!',
            text: 'New job posting created successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Close the modal after success
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.hide(); // Hide the modal

            // Optionally, reload the page or update content dynamically
            location.reload(); // Refresh the page to display new content
        });

        // clear form fields
        form.reset();
        questionsContainer.innerHTML = '';

        // alert("Assessment created successfully!");
    }).catch(error => {
        // Handle errors
        console.error("Error creating assessment: ", error);
        Swal.fire({
            title: 'Error!',
            text: 'Oops! Something went wrong while creating your job posting.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});

document.getElementById('createAssessmenttn').addEventListener('click', () => {
    const assessmentForm = document.getElementById('assessmentForm');
    // Make the form visible
    assessmentForm.style.display = 'block';
    // Hide the button
    document.getElementById('createAssessmenttn').style.display = 'none';
});

document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const newQuestion = questionTemplate.content.cloneNode(true);
    questionsContainer.appendChild(newQuestion);
    // checkIfDeleteShouldBeDisabled();

    // Find the delete button in the newly added question and attach an event listener
    // Locate the most recently added content (added to the DOM)
    const latestQuestion = questionsContainer.lastElementChild; // Get the last child element
    // Find the delete button in the most recently added content
    const deleteButton = latestQuestion.querySelector('.delete-question-btn');
    console.log("Delete Button:", deleteButton);
    attachDeleteListener(deleteButton);
});

// Function for attaching delete functionality
function attachDeleteListener(deleteButton) {
    deleteButton.addEventListener('click', (event) => {
        // Find the entire card wrapper (e.g., the full question card)
        const cardElement = event.target.closest('.card'); // `.card` is the outer container of the question
        if (cardElement) {
            cardElement.remove(); // Remove the entire card
        } else {
            console.warn("Card element not found for delete action");
        }
    });
}

// document.getElementById('deleteQuestionBtn').addEventListener('click', () => {
//     Swal.fire({
//         title: 'Are you sure?',
//         text: 'Do you want to delete this question?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, delete it!',
//         cancelButtonText: 'Cancel'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             const questions = document.querySelectorAll('.question');
//             if (questions.length > 1) {
//                 questions[questions.length - 1].remove();
//                 questionsContainer.removeChild(questionsContainer.lastChild);
//             }
//             // checkIfDeleteShouldBeDisabled();

//             Swal.fire('Deleted!', 'Your question has been deleted.', 'success');
//         }
//     });
// });


// function checkIfDeleteShouldBeDisabled() {
//     const questions = document.querySelectorAll('.question');
//     if (questions.length === 1) {
//         document.getElementById('deleteQuestionBtn').disabled = true;
//     } else {
//         document.getElementById('deleteQuestionBtn').disabled = false;
//     }
// }

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("assessmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection)
        .orderBy("timestamp", "desc")
        .get()   //the collection called 
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
                    Swal.fire({
                        title: 'Delete <b>' + title + '</b?>?',
                        text: 'This cannot be undone.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            db.collection("assessments").doc(assessmentDocID).delete().then(() => {
                                Swal.fire(
                                    'Deleted!',
                                    'The posting has been deleted successfully.',
                                    'success'
                                );
                                location.reload(); // Reload the page to reflect the changes
                            }).catch(error => {
                                console.error("Error deleting posting: ", error);
                                Swal.fire(
                                    'Error!',
                                    'There was an issue deleting the posting.',
                                    'error'
                                );
                            });
                        }
                    });
                });

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("assessmentList").appendChild(newcard);
                // checkIfDeleteShouldBeDisabled();

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("assessments");

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





