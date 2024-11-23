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
