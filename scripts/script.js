//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("logging out user");

      // removing teh user from the local storage
      localStorage.removeItem("user");
      // userid too
      localStorage.removeItem("userid");

      //clear all memory
      localStorage.clear();

      // without this check, it just loops over and over again 🥲
      console.log(window.location.href);

      const pathname = window.location.pathname;
      const lastPart = pathname.split('/').pop();

      if (lastPart != "index.html") {
        window.location.href = "index.html";
      }


    }).catch((error) => {
      // An error happened.
    });
}


function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          console.log(user.uid); // Let's know who the logged-in user is by logging their UID
          currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
          currentUser.get().then(userDoc => {
              // Get the user name
              let userName = userDoc.data().name;
              console.log(userName);
              //$("#name-goes-here").text(userName); // jQuery
              document.getElementById("name-goes-here").innerText = userName;
              document.getElementById("name-goes-here-hike").innerText = userName;
          })
      } else {
          console.log("No user is logged in."); // Log a message when no user is logged in
      }
  })
}

insertNameFromFirestore()
