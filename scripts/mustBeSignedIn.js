function checkAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            // no user is signed in, so we redirect to the login page !
            window.location.href = 'login.html';
        }

    });
}

checkAuth();