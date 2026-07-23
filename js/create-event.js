
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


let eventCount = 0;

function newEvent(){

    const title =
        document.getElementById("title").value;

    const date =
        document.getElementById("date").value;
    
    const time =
        document.getElementById('time').value;

    const description =
        document.getElementById("description").value;

    const image =
        document.getElementById("image").files[0];
    const userInfo = 
        JSON.parse(localStorage.getItem('userInformation'))
    const eventCreator =
        userInfo[0]

    if(!title || !date || !time){
        alert("Please fill out all required fields.");
        return;
    }

    if(!eventCreator){
        alert('log in to create an event');
        return;
    }

    const retreivedData = JSON.parse(localStorage.getItem('eventStorage'))
    retreivedData.push([title, date, time, description, image, eventCreator])
    console.log(retreivedData)
    localStorage.setItem('eventStorage', JSON.stringify(retreivedData))
}


if (!sessionStorage.getItem('hasVisited')) {
    localStorage.setItem('loggedIn', false)
  console.log("Welcome! This is your very first time here in this session.");
  
  // Set the flag so this block won't run again on reload
  sessionStorage.setItem('hasVisited', 'true');
} else {
  console.log("Page has been reloaded or navigated to previously.");
}
