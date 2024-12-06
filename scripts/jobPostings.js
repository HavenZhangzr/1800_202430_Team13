function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("assessmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called 
        .then(allAssessments=> {
            allAssessments.forEach(doc => { //iterate thru each doc
                var assessmentDocID = doc.id;
                var title = doc.data().role;
                var description = doc.data().description;
                var details = "<b>Company: </b>" + doc.data().company + "<br><b>Role: </b>" + doc.data().role + "<br><b>Team: </b>" + doc.data().team + "<br><b>Description: </b>" + doc.data().description;
                
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-description').innerHTML = description;
                newcard.querySelector('.card-details').innerHTML = details;
                newcard.querySelector('a').href = "jobApply.html?docID=" + assessmentDocID + "&title=" + title;

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("assessmentList").appendChild(newcard);
            })
        })
}

displayCardsDynamically("assessments");  //input param is the name of the collection

