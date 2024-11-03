async function loadPhoneCodes() {
    try {

        const response = await fetch('https://restcountries.com/v3.1/all');
        let countries = await response.json();

        // Sort country names alphabetically
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

        const phoneDropdown = document.getElementById('dialingCode');

        countries.forEach(country => {
            if (country.idd && country.idd.root) { // Ensure the country has a dialing code
                const option = document.createElement('option');
                option.value = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');
                // option.text = `${country.flag} ${option.value}`;
                option.text = `${country.name.common} ${country.flag} (${option.value})`; // Display country name and dialing code only
                phoneDropdown.appendChild(option);
            }
        });
        console.log("Phone codes added to dropdown.");
    } catch (error) {
        console.error("Error loading phone codes:", error);
    }
}

// Call after page loads
document.addEventListener('DOMContentLoaded', loadPhoneCodes);

async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        let countries = await response.json();
        
        // Sort country names alphabetically
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        const dropdown = document.getElementById('country');

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');
            option.text = `${country.name.common}`; // Display only the country name
            dropdown.appendChild(option);
        });

        console.log("Countries added to dropdown.");
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

// Call after page loads
document.addEventListener('DOMContentLoaded', loadCountries);

// Load profile data from Firestore
function loadProfileData() {
    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User is logged in');
            const userDocRef = db.collection("profile").doc(user.uid);
            userDocRef.get().then(function(doc) {
                if (doc.exists) {
                    // If the document exists, load the data and display it on the page
                    const profileData = doc.data();
                    document.getElementById("firstName").value = profileData.firstName || '';
                    document.getElementById("lastName").value = profileData.lastName || '';
                    document.getElementById("username").value = profileData.username || '';
                    document.getElementById("email").value = profileData.email || '';
                    document.getElementById("dialingCode").value = profileData.dialingCode || '';
                    document.getElementById("phoneNumber").value = profileData.phoneNumber || '';
                    document.getElementById("country").value = profileData.country || '';
                    document.getElementById("address").value = profileData.address || '';
                    document.getElementById("city").value = profileData.city || '';
                    document.getElementById("zip").value = profileData.zip || '';

                    console.log("Profile data loaded successfully.");
                } else {
                    console.log("No profile data found. User must create a profile.");
                    // Prompt the user to fill in their profile
                }
            }).catch(function(error) {
                console.error("Error getting profile data: ", error);
            });
        } else {
            console.log("User not logged in");
            // Prompt the user to log in
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    });
}

// When the page loads, check the user login status and load profile data
document.addEventListener('DOMContentLoaded', loadProfileData);

// Write profile data
function saveProfileData(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the feedback element
    const feedbackElement = document.getElementById("feedback");
    
    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const userDocRef = db.collection("profile").doc(user.uid);

            // Check if the document exists
            userDocRef.get().then(function(doc) {
                if (doc.exists) {
                    // If the document exists, perform an update operation
                    userDocRef.update({
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        username: document.getElementById("username").value,
                        email: document.getElementById("email").value,
                        dialingCode: document.getElementById("dialingCode").value,
                        phoneNumber: document.getElementById("phoneNumber").value,
                        country: document.getElementById("country").value,
                        address: document.getElementById("address").value,
                        city: document.getElementById("city").value,
                        zip: document.getElementById("zip").value
                    })
                    .then(function() {
                        feedbackElement.textContent = "Profile updated successfully."; // Feedback message
                        feedbackElement.style.color = "green"; // Green for success
                    })
                    .catch(function(error) {
                        feedbackElement.textContent = "Error updating profile: " + error.message; // Feedback message
                        feedbackElement.style.color = "red"; // Red for error
                        console.error("Error updating profile: ", error);
                    });
                } else {
                    // If the document does not exist, perform a create operation
                    userDocRef.set({
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        username: document.getElementById("username").value,
                        email: document.getElementById("email").value,
                        dialingCode: document.getElementById("dialingCode").value,
                        phoneNumber: document.getElementById("phoneNumber").value,
                        country: document.getElementById("country").value,
                        address: document.getElementById("address").value,
                        city: document.getElementById("city").value,
                        zip: document.getElementById("zip").value
                    })
                    .then(function() {
                        feedbackElement.textContent = "Profile saved successfully."; // Feedback message
                        feedbackElement.style.color = "green"; // Green for success
                    })
                    .catch(function(error) {
                        feedbackElement.textContent = "Error saving profile: " + error.message; // Feedback message
                        feedbackElement.style.color = "red"; // Red for error
                        console.error("Error saving profile: ", error);
                    });
                }
            }).catch(function(error) {
                feedbackElement.textContent = "Error getting profile: " + error.message; // Feedback message
                feedbackElement.style.color = "red"; // Red for error
                console.error("Error getting profile: ", error);
            });
        } else {
            console.log("User not logged in");
            // Prompt the user to log in
            feedbackElement.textContent = "Please log in to save your profile."; // Feedback message
            feedbackElement.style.color = "orange"; // Orange for prompt
        }
    });
}


// Wait for the page to load, then bind the submit event
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", saveProfileData);
});








