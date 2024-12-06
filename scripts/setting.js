function saveSettings(event) {
    event.preventDefault(); // Prevent the default page refresh behavior

    // Check the user's login status
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const settingsDocRef = db.collection("settings").doc(user.uid); // Get the document reference for the current user's settings

            // Collect the settings data
            const settingsData = {
                emailNotifications: document.getElementById("emailNotifications").checked,
                notificationMethod: document.getElementById("notificationMethod").value,
                notificationFrequency: document.getElementById("notificationFrequency").value,
                profileVisibility: document.getElementById("profileVisibility").value,
                activityStatus: document.getElementById("activityStatus").checked,
                locationSharing: document.getElementById("locationSharing").checked,
                dataAccess: {
                    linkedIn: document.getElementById("accessLinkedIn").checked,
                    google: document.getElementById("accessGoogle").checked,
                    recruiters: document.getElementById("accessRecruiters").checked,
                    thirdParty: document.getElementById("accessThirdParty").checked
                },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() // Save the timestamp of the update
            };

            // Save the settings data to Firestore
            settingsDocRef.set(settingsData) // `.set` will overwrite or create the document
                .then(function () {
                    // Show a success message using Swal
                    Swal.fire("Success!", "Your settings have been saved.", "success");
                    console.log("Settings saved successfully!"); // Log success to the console
                })
                .catch(function (error) {
                    // Show an error message using Swal
                    Swal.fire("Error!", "There was an error saving your settings: " + error.message, "error");
                    console.error("Error saving settings: ", error); // Log error to the console
                });
        } else {
            console.log("User not logged in");
            // Show a warning message using Swal if not logged in
            Swal.fire("Not Logged In", "Please log in to save your settings.", "warning");
        }
    });
}

// Wait for the page to load and then bind the click event to the save button
document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.querySelector(".btn-success");
    saveButton.addEventListener("click", saveSettings);
});

// When the page loads, check the user's login status and load their profile data
document.addEventListener('DOMContentLoaded', loadSettingsData);

// Load settings data
function loadSettingsData() {
    console.log("loadSettingsData");

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const settingsDocRef = db.collection("settings").doc(user.uid); // Get the settings data for the user

            // Get the settings document from Firestore
            settingsDocRef.get().then(function (doc) {
                if (doc.exists) {
                    const settingsData = doc.data(); // Get the settings data
                    // Populate the form fields with the settings data
                    document.getElementById("emailNotifications").checked = settingsData.emailNotifications || false;
                    document.getElementById("notificationMethod").value = settingsData.notificationMethod || '';
                    document.getElementById("notificationFrequency").value = settingsData.notificationFrequency || '';
                    document.getElementById("profileVisibility").value = settingsData.profileVisibility || '';
                    document.getElementById("activityStatus").checked = settingsData.activityStatus || false;
                    document.getElementById("locationSharing").checked = settingsData.locationSharing || false;
                    document.getElementById("accessLinkedIn").checked = settingsData.dataAccess.linkedIn || false;
                    document.getElementById("accessGoogle").checked = settingsData.dataAccess.google || false;
                    document.getElementById("accessRecruiters").checked = settingsData.dataAccess.recruiters || false;
                    document.getElementById("accessThirdParty").checked = settingsData.dataAccess.thirdParty || false;
                    console.log("Settings loaded successfully!"); // Log success to the console
                } else {
                    console.log("No settings found. You can save new settings.");
                }
            }).catch(function (error) {
                console.error("Error loading settings: ", error); // Log error to the console
            });
        } else {
            console.log("User not logged in");
            console.log("Please log in to load your settings.");
        }
    });
}