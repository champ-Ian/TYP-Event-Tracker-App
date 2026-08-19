if (!localStorage.getItem('didRun')) {
    let eventArray = []

    for (let i=0; i<1; i++) {
        eventArray[i] = []
        for(let j = 0; j < 5; j++) {
            eventArray[i][0] = 'Placeholder Event'
        }
    }   
    console.log(eventArray)
    localStorage.setItem('eventStorage', JSON.stringify(eventArray))

  localStorage.setItem('didRun', 'true');
}

const personLoggedIn = sessionStorage.getItem('loggedIn');
const userInfo = JSON.parse(sessionStorage.getItem('userInformation'))


let eventCount = 0;

function newEvent(){
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").files[0];
    const eventCreator = userInfo[2]

    if(!title || !date || !startTime || !location || !endTime){
        alert("Please fill out all required fields.");
        return;
    }

    if(personLoggedIn !== "true"){
        alert('log in to create an event');
        return;
    }


    function saveToStorage(image) {
        const retreivedData = JSON.parse(localStorage.getItem('eventStorage'))
        retreivedData.push([title, date, startTime, description, image, eventCreator, endTime])
        localStorage.setItem('eventStorage', JSON.stringify(retreivedData))
    }


    if(image) {
        const imageReader = new FileReader()

        imageReader.onload = function(e) {
            const b64image = e.target.result
            saveToStorage(b64image)
        }
        imageReader.readAsDataURL(image)
    } else {
        saveToStorage(null)
    }

    alert('your event has successfully been created')
}

if (!sessionStorage.getItem('hasVisited')) {
    sessionStorage.setItem('loggedIn', 'false')
  console.log("Welcome! This is your very first time here in this session.");

  // Set the flag so this block won't run again on reload
  sessionStorage.setItem('hasVisited', 'true');
} else {
  console.log("Page has been reloaded or navigated to previously.");
}
