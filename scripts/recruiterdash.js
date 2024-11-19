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
                correct: correct
            });
        });
    });

    alert("Your assessment has been submitted!");
});

// Add event listener to the "Add Question" button
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const newQuestion = questionTemplate.content.cloneNode(true);
    questionsContainer.appendChild(newQuestion);
});