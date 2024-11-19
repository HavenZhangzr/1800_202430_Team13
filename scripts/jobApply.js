//points to the document of the user who is logged in
var currentUser;

/**
 * Populate user information by listening to authentication state changes.
 * This function identifies the signed-in user and points to their Firestore document.
 */
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

// Call the function to initialize user information.
populateUserInfo();

// Extract parameters from the current URL to get assessment details.
let params = new URL(window.location.href) //get the url from the search bar
let assessmentDocID = params.searchParams.get("docID");
let assessmentTitle = params.searchParams.get("title");

/**
 * Fetch and display questions for a given assessment.
 * param assessmentDocID - Document ID of the assessment.
 */
function getAssementContent(assessmentDocID) {

    // Reference templates for multiple-choice and short-answer questions.
    const cardTemplateMultipleChoice = document.getElementById("multipleChoiceTemp");
    const cardTemplateShortAnswer = document.getElementById("shortAnswerTemp");

    // Fetch questions from the Firestore collection of the specified assessment.
    db.collection('assessments').doc(assessmentDocID).collection('questions').get()
        .then(allQuestions => {
            allQuestions.forEach(doc => {
                const data = doc.data(); // Read question data
                const isMultipleChoice = data.isMultipleChoice;
                const questionText = data.question; // The actual question text
                const options = data.answers; // Options for multiple-choice questions (if applicable)
                const uniqueName = `q_${doc.id}`; // Unique name for inputs based on question ID

                let newCard;

                // Handle multiple-choice questions
                if (isMultipleChoice) {
                    // Clone the multiple-choice template
                    newCard = cardTemplateMultipleChoice.content.cloneNode(true);
                    newCard.querySelector('.card-title').textContent = questionText;

                    // Update radio button options dynamically
                    const radioButtons = newCard.querySelectorAll('.form-check');
                    radioButtons.forEach((radioButton, index) => {
                        radioButton.querySelector('input').name = uniqueName;
                        radioButton.querySelector('label').textContent = `${String.fromCharCode(65 + index)}. ${options[index]}`;
                    });
                    // Save question document ID in the UI for reference
                    newCard.querySelector('.mul_QuestionsDocID').textContent = doc.id;
                    // Append the populated card to the multiple-choice section
                    document.getElementById('multipleChoiceQuestions').appendChild(newCard);
                } else {
                    // Handle short-answer questions
                    newCard = cardTemplateShortAnswer.content.cloneNode(true);
                    newCard.querySelector('label').textContent = questionText;

                    // Configure the text area
                    const textArea = newCard.querySelector('textarea');
                    textArea.setAttribute('name', `q${doc.id}`);
                    textArea.classList.add('short-answer-question');
                    newCard.querySelector('.short_QuestionsDocID').textContent = doc.id;

                    // Append the populated card to the short-answer section
                    document.getElementById('shortAnswerQuestions').appendChild(newCard);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
        });
}

// Call the function to fetch and display assessment questions.
getAssementContent(assessmentDocID);

/**
 * Submit the assessment answers to Firestore.
 */
function submitAssessment(e) {
    e.preventDefault();

    const multipleChoiceAnswers = {}; // Prevent default form submission behavior
    const shortAnswerAnswers = {};

    // Collect multiple-choice answers
    const mcQuestions = document.querySelectorAll('#multipleChoiceQuestions .card');
    mcQuestions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const lbl_questionsDocID = question.querySelector('.mul_QuestionsDocID');
            const questionsDocID = lbl_questionsDocID.textContent;
            multipleChoiceAnswers[questionsDocID] = selectedOption.value;
        }
    });

    // Collect short-answer responses
    const shortAnswerQuestions = document.querySelectorAll('#shortAnswerQuestions .form-group');
    shortAnswerQuestions.forEach((question, index) => {
        const textArea = question.querySelector('textarea');
        const answerText = textArea ? textArea.value : '';
        if (answerText) {
            const lbl_questionsDocID = question.querySelector('.short_QuestionsDocID');
            const questionsDocID = lbl_questionsDocID.textContent;
            shortAnswerAnswers[questionsDocID] = answerText;
        }
    });

    // Save answers to Firestore under the current user's collection
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const saveLocation = db.collection("assessments").doc(assessmentDocID);
            saveLocation.collection('responses').doc(user.uid).set({
                assessmentDocID: assessmentDocID,
                assessmentTitle: assessmentTitle,
                multipleChoiceAnswers: multipleChoiceAnswers,
                shortAnswerAnswers: shortAnswerAnswers,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
                .then(() => {
                    console.log("Answers successfully saved!");
                    window.location.href = "assessment_completed.html";
                })
                .catch(error => {
                    console.error("Error saving answers: ", error);
                });
        } else {
            console.log("No user is signed in");
        }
    });
}

// Attach the submit handler to the form when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", submitAssessment);
});