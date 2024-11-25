
alert("ATTN: THIS FILE IS DEPRICATED. YOU SHOULDN'T BE ABLE TO NAVIGATE HERE");

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("assessmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called 
        .then(allAssessments=> {
            // var i = 1;  //Optional: if you want to have a unique ID
            allAssessments.forEach(doc => { //iterate thru each doc
                var assessmentDocID = doc.id;
                var title = doc.data().title;
                var description = doc.data().description;
                var details = "Difficulty: " + doc.data().difficulty +"/10" + "<br>Time: " + doc.data().duration + " minutes" + "<br>" + "Success Rate: " + doc.data().successRate + "%";
                
                // var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-description').innerHTML = description;
                newcard.querySelector('.card-details').innerHTML = details;
                newcard.querySelector('a').href = "readwriteassessment.html?docID=" + assessmentDocID + "&title=" + title;
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("assessmentList").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("assessments");  //input param is the name of the collection

console.log("assessmentsList.js loaded"); // Log a message to the console to indicate that this script was loaded.