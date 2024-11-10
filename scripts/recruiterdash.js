// Reference to the form
const form = document.getElementById('assessmentsubmission');
const jobinput = document.getElementById('hardcoded');

// Add event listener to the form
form.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Capture values from the form fields
    const role = form.role.value;
    const company = form.company.value;
    const team = form.team.value;
    const question = form.question.value;
    const solution = form.solution.value;
    const ends = form.ends.value;

    // Add data to Firestore
    db.collection('assessments').add({
        role: role,
        company: company,
        team: team,
        question: question,
        solution: solution,
        ends: ends
    })
    .then(() => {
        console.log("Data successfully submitted!");
        form.reset(); 
    })
    .catch((error) => {
        console.error("Error submitting data: ", error);
    });
});

jobinput.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const userinput = jobinput.elements.hardcodedquestion.value;

    db.collection('useranswers').add({
        answer: userinput, 
    })
    .then(() => {
        console.log("Data successfully submitted!");
        jobinput.reset(); 
    })
    .catch((error) => {
        console.error("Error submitting data: ", error);
    });
});