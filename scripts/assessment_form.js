//points to the document of the user who is logged in
var currentUser;

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

//call the function to run it 
populateUserInfo();

let params = new URL(window.location.href) //get the url from the search bar
let assessmentDocID = params.searchParams.get("docID");
let assessmentTitle = params.searchParams.get("title");

function getAssementContent(assessmentDocID) {
    const cardTemplateMultipleChoice = document.getElementById("multipleChoiceTemp");
    const cardTemplateShortAnswer = document.getElementById("shortAnswerTemp");

    db.collection('assessments').doc(assessmentDocID).collection('questions').get()
        .then(allQuestions => {
            allQuestions.forEach(doc => {
                const data = doc.data();
                const questionType = data.type;
                const questionText = data.question;
                const options = data.options;
                const uniqueName = `q_${doc.id}`;

                let newCard;

                if (questionType === 'multiple-choice') {
                    newCard = cardTemplateMultipleChoice.content.cloneNode(true);
                    newCard.querySelector('.card-title').textContent = questionText;
                    const radioButtons = newCard.querySelectorAll('.form-check');
                    radioButtons.forEach((radioButton, index) => {
                        radioButton.querySelector('input').name = uniqueName;
                        radioButton.querySelector('label').textContent = `${String.fromCharCode(65 + index)}. ${options[index]}`;
                    });
                    newCard.querySelector('.mul_QuestionsDocID').textContent = doc.id;

                    document.getElementById('multipleChoiceQuestions').appendChild(newCard);
                } else if (questionType === 'short-answer') {

                    newCard = cardTemplateShortAnswer.content.cloneNode(true);
                    newCard.querySelector('label').textContent = questionText;

                    const textArea = newCard.querySelector('textarea');
                    textArea.setAttribute('name', `q${doc.id}`);
                    textArea.classList.add('short-answer-question');
                    newCard.querySelector('.short_QuestionsDocID').textContent = doc.id;

                    document.getElementById('shortAnswerQuestions').appendChild(newCard);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching questions:", error);
        });
}

getAssementContent(assessmentDocID);

function submitAssessment(e) {
    e.preventDefault();

    const multipleChoiceAnswers = {};
    const shortAnswerAnswers = {};

    const mcQuestions = document.querySelectorAll('#multipleChoiceQuestions .card');
    mcQuestions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const lbl_questionsDocID = question.querySelector('.mul_QuestionsDocID');
            const questionsDocID = lbl_questionsDocID.textContent;
            multipleChoiceAnswers[questionsDocID] = selectedOption.value;
        }
    });

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

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const currentUser = db.collection("users").doc(user.uid);
            currentUser.collection('answers').add({
                assessmentDocID: assessmentDocID,
                assessmentTitle: assessmentTitle,
                multipleChoiceAnswers: multipleChoiceAnswers,
                shortAnswerAnswers: shortAnswerAnswers,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
                .then(() => {
                    console.log("Answers successfully saved!");
                })
                .catch(error => {
                    console.error("Error saving answers: ", error);
                });
        } else {
            console.log("No user is signed in");
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", submitAssessment);
});

// writeQuestion template
// function writeQuestion() {
//     const assessmentRef = db.collection('assessments').doc('3AdAyGkGtPdjCKh3tocY');
//     const questionsRef = assessmentRef.collection('questions');
//     // multiple choice
//     const multipleChoiceQuestions = [
//         {
//             question: 'What does "responsive web design" mean?',
//             options: ['Websites are designed to fit any screen size.', 'Websites are designed only for mobile screens.', 'Websites can only be accessed on desktop computers.', 'Websites use more media queries.'],
//             answer: 'Websites are designed to fit any screen size.'
//         },
//         {
//             question: 'Which CSS property is most commonly used for making a website responsive?',
//             options: ['display', 'flex', 'width', 'media queries'],
//             answer: 'media queries'
//         },
//         {
//             question: 'What is a media query in CSS?',
//             options: ['A query used to ask about the style of a page.', 'A CSS rule that applies styles based on device characteristics.', 'A JavaScript function used to detect screen size.', 'A type of selector used for responsive design.'],
//             answer: 'A CSS rule that applies styles based on device characteristics.'
//         },
//         {
//             question: 'Which of the following is NOT a benefit of responsive design?',
//             options: ['Mobile-first design', 'Improved SEO rankings', 'More design flexibility', 'Limited device support'],
//             answer: 'Limited device support'
//         },
//         {
//             question: 'Which property is used to control the layout in responsive design?',
//             options: ['padding', 'flexbox', 'box-sizing', 'overflow'],
//             answer: 'flexbox'
//         },
//         {
//             question: 'Which of the following is a best practice for creating a responsive layout?',
//             options: ['Use fixed widths for all elements.', 'Avoid using flexbox.', 'Use relative units like % or vw for width and height.', 'Make images fixed size for better control.'],
//             answer: 'Use relative units like % or vw for width and height.'
//         },
//         {
//             question: 'How do media queries work in responsive web design?',
//             options: ['They apply styles only when the screen width is greater than a specific value.', 'They apply styles based on device screen size or resolution.', 'They are used to detect the user’s location.', 'They change the font size of the page based on user input.'],
//             answer: 'They apply styles based on device screen size or resolution.'
//         },
//         {
//             question: 'Which viewport meta tag is essential for responsive web design?',
//             options: ['<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta name="viewport" content="width=100%, initial-scale=1.0">', '<meta name="viewport" content="scale=1">', '<meta name="viewport" content="auto-width=1">'],
//             answer: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
//         },
//         {
//             question: 'What does the term "mobile-first design" refer to?',
//             options: ['Designing websites with mobile screens as the priority, then scaling up for desktops.', 'Designing websites for desktop screens first, then adapting for mobile.', 'Designing websites that only work on mobile devices.', 'Designing websites without using media queries.'],
//             answer: 'Designing websites with mobile screens as the priority, then scaling up for desktops.'
//         },
//         {
//             question: 'Which CSS property helps with responsiveness in images?',
//             options: ['max-width', 'width', 'height', 'border'],
//             answer: 'max-width'
//         }
//     ];

//     // Add multiple choice to Firebase
//     multipleChoiceQuestions.forEach((question) => {
//         questionsRef.add({
//             type: 'multiple-choice',
//             question: question.question,
//             options: question.options,
//             answer: question.answer
//         });
//     });

//     // free-write
//     const shortAnswerQuestions = [
//         {
//             question: 'Explain the concept of "mobile-first design" in responsive web design.'
//         },
//         {
//             question: 'Why is it important to use relative units like percentages or viewport widths (vw) in responsive design?'
//         },
//         {
//             question: 'How does the "flexbox" layout help in making a website responsive?'
//         }
//     ];

//     // Add free-write to Firebase
//     shortAnswerQuestions.forEach((question) => {
//         questionsRef.add({
//             type: 'short-answer',
//             question: question.question
//         });
//     });
// }
// writeQuestion();
