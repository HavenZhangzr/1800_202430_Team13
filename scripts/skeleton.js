//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.

            // read the firestore and check if this user is a recruiter or not
            const userRef = db.collection("users").doc(user.uid);
            userRef.get().then(doc => {
                if (doc.exists) {
                    if (doc.data().isRecruiter) {
                        $('#navbarPlaceholder').load('./text/nav_RECRUITER.html');
                    } else {
                        $('#navbarPlaceholder').load('./text/nav_JOB_SEEKER.html');
                    }
                } else {
                    console.log("No such document! U*(U@*(RU@*($RU@(*UR@(*UR@(U");
                }
            });




            console.log("USER LOGGED IN 😎");
        } else {
            // No user is signed in.
            $('#navbarPlaceholder').load('./text/nav_before_login.html');
            console.log("NO USER 😭");
        }
        console.log($('#footerPlaceholder').load('./text/footer.html'));
    });
}

loadSkeleton(); //invoke the function