


document.addEventListener('DOMContentLoaded', function() {
    const userSelect = document.getElementById('userSelect');
    const userResponses = document.getElementById('userResponses');
    const params = new URLSearchParams(window.location.search);
    const assessmentDocID = params.get('docID');

    // Fetch assessment details
    db.collection('assessments').doc(assessmentDocID).get().then(assessmentDoc => {
        if (assessmentDoc.exists) {
            const assessmentData = assessmentDoc.data();
            const assessmentTitle = `${assessmentData.company}: ${assessmentData.role}`;
            document.getElementById('assessmentTitle').textContent = assessmentTitle;
        }
    });

    // Fetch user IDs from Firestore
    db.collection('assessments').doc(assessmentDocID).collection('responses').get().then(snapshot => {
        snapshot.forEach(doc => {
            const userID = doc.id;
            // Fetch user name from the users collection
            db.collection('users').doc(userID).get().then(userDoc => {
                if (userDoc.exists) {
                    const userName = userDoc.data().name;
                    const option = document.createElement('option');
                    option.value = userID;
                    option.textContent = userName;
                    userSelect.appendChild(option);
                }
            });
        });
    });

    // Fetch and display user responses when a user is selected
    userSelect.addEventListener('change', function() {
        const userID = userSelect.value;
        if (userID) {
            db.collection('assessments').doc(assessmentDocID).collection('responses').doc(userID).get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    // Fetch user name and email from the users collection
                    db.collection('users').doc(userID).get().then(userDoc => {
                        if (userDoc.exists) {
                            const userName = userDoc.data().name;
                            const userEmail = userDoc.data().email;
                            // reusme link is in the same collection as the multiple choice asnwers

                            const userResumeLink = data.resumeLink;
                            userResponses.innerHTML = `
                                <h4>Responses for ${userName}</h4>
                                <h5>Email: ${userEmail}</h5>
                                <a href="${userResumeLink}" target="_blank" class="btn btn-primary">View Resume</a>
                                <br> <br>
                                <h3> Question Responses </h3>
                                <hr> 
                            `;

                            // Fetch questions and display responses
                            db.collection('assessments').doc(assessmentDocID).collection('questions').get().then(questionsSnapshot => {
                                questionsSnapshot.forEach(questionDoc => {
                                    const questionData = questionDoc.data();
                                    const questionID = questionDoc.id;
                                    const userAnswer = data.multipleChoiceAnswers[questionID] || data.shortAnswerAnswers[questionID];
                                    const correctAnswers = "<br>" + questionData.correct.join('<br> ');

                                    userResponses.innerHTML += `
                                        <div class="card mb-3">
                                            <div class="card-body">
                                                <h5 class="card-title">${questionData.question}</h5>
                                                <p class="card-text"><strong>Applicant Answer:</strong> ${userAnswer}</p>
                                                <p class="card-text"><strong>Correct Answers:</strong> ${correctAnswers}</p>
                                            </div>
                                        </div>
                                    `;
                                });
                            });
                        }
                    });
                } else {
                    userResponses.innerHTML = `<p>No responses found for ${userID}</p>`;
                }
            });
        } else {
            userResponses.innerHTML = '';
        }
    });
});