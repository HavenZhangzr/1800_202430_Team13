// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var redirectURL;

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: async function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;                            // get the user object from the Firebase authentication database
            if (authResult.additionalUserInfo.isNewUser) {
                // Add new user to Firestore
                try {
                    await db.collection("users").doc(user.uid).set({
                        name: user.displayName,
                        email: user.email,
                        date_created: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                    console.log("New user added to Firestore.");
                    window.location.assign("before_account_type.html");
                } catch (error) {
                    console.log("Error adding new user:", error);
                }
            } else {
                // Check user role
                try {
                    const doc = await db.collection("users").doc(user.uid).get();
                    if (doc.exists) {
                        const userData = doc.data();
                        if (userData.isRecruiter) {
                            window.location.assign("recruiterdashboard.html");
                        } else {
                            window.location.assign("dashboard.html");
                        }
                    } else {
                        console.log("User document not found.");
                    }
                } catch (error) {
                    console.log("Error retrieving user document:", error);
                }
            }
            return false; // Prevent automatic redirection
        },
    },
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>',
};

ui.start('#firebaseui-auth-container', uiConfig);