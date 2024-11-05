
//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgDVV2SabbK67Bmd81zB5xpGwpBEoWTuo",
  authDomain: "comp1800-bby13-bc8f5.firebaseapp.com",
  projectId: "comp1800-bby13-bc8f5",
  storageBucket: "comp1800-bby13-bc8f5.firebasestorage.app",
  messagingSenderId: "692716861774",
  appId: "1:692716861774:web:ca16b35a90d4ad37a6061f"
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Reference to the form
const form = document.getElementById('assessmentsubmission');

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