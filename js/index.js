// Read stored events from localStorage. If parsing fails or the value
// isn't an array, fall back to an empty array so the page doesn't error.
let eventArray;
try {
    eventArray = JSON.parse(localStorage.getItem('eventStorage'))
} catch (e) {
    console.error('Failed to parse eventStorage:', e)
    eventArray = []
}
if (!Array.isArray(eventArray)) eventArray = []
console.log('eventArray', eventArray)






// Select the sections in the page where upcoming and past events will be
// appended. These match the markup in `index.html` (`.upcomingEvents`/`.pastEvents`).
const currentEventSection = document.querySelector('.upcomingEvents')
const pastEventSection = document.querySelector('.pastEvents')

// Number of stored events. Note: this code starts at index 1 because
// index 0 is used for placeholder data in `create-event.js`.
let eventAmount = eventArray.length

// Loop through stored events and build DOM nodes for each one.
for (let i = 1; i < eventAmount; i++) {

    const eventBlock = document.createElement('div');
    eventBlock.className = 'event'

    const eventInfo1 = document.createElement('div')
    eventInfo1.className = 'eventinfo1'

    const eventInfo = document.createElement('div')
    eventInfo.className = 'eventinfo'

    const seeMore = document.createElement('div')
    seeMore.className = 'seeMore'

    const seeMoreText = document.createElement('button')
    seeMoreText.className = 'seeMoreText'
    seeMoreText.textContent = 'See More'

    const dotDotDot = document.createElement('i')
    dotDotDot.className = 'fa-solid fa-ellipsis'



    // Event title is stored at index 0 of the event array
    const eventName = document.createElement('h2');
    eventName.textContent = eventArray[i][0]
    eventName.className = 'eventTitle'

    // Format stored ISO date (YYYY-MM-DD) to MM/DD/YYYY for display
    const eventDate = document.createElement('h4');
    const formattedDate = `${eventArray[i][1].slice(5, 7)}/${eventArray[i][1].slice(8, 10)}/${eventArray[i][1].slice(0, 4)}`
    eventDate.textContent = formattedDate

    // Convert 24-hour `HH:MM` stored time into a human-friendly 12-hour
    // string for display (e.g., `14:30` -> `2:30 PM`). This is simple and
    // assumes the stored string is always `HH:MM`.
    const eventTime = document.createElement('h4');
    let formattedStartTime = null
    if (eventArray[i][2].slice(0,2) == 12){
        formattedStartTime = `12:00 PM`
    } else if (eventArray[i][2].slice(0,2) == 00) {
        formattedstartTime = '12:00 AM'
    } else if (eventArray[i][2].slice(0,2) < 12) {
        formattedStartTime = `${eventArray[i][2]} AM`
    } else {
        formattedStartTime = `${eventArray[i][2].slice(0,2) - 12}:${eventArray[i][2].slice(3, 5)} PM`
    }

    let formattedEndTime = null
    if (eventArray[i][6].slice(0,2) == 12){
        formattedEndTime = `12:00 PM`
    } else if (eventArray[i][6].slice(0,2) == 00) {
        formattedEndTime = '12:00 AM'
    } else if (eventArray[i][6].slice(0,2) < 12) {
        formattedEndTime = `${eventArray[i][6]} AM`
    } else {
        formattedEndTime = `${eventArray[i][6].slice(0,2) - 12}:${eventArray[i][6].slice(3, 5)} PM`
    }

    let formattedTime = `${formattedStartTime} - ${formattedEndTime}`
    eventTime.textContent = formattedTime

    seeMore.appendChild(seeMoreText)
    seeMore.appendChild(dotDotDot)
    eventInfo.appendChild(eventDate)
    eventInfo.appendChild(eventTime)
    eventInfo1.appendChild(eventInfo)
    eventInfo1.appendChild(seeMore)
    eventBlock.appendChild(eventName)
    eventBlock.appendChild(eventInfo1)

    // Decide whether the event is past or upcoming by comparing today's
    // date to the stored date string (YYYY-MM-DD). This is a simple
    // lexicographic comparison that works with the ISO format. For same-day
    // events it also compares times (approximate).
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDate = `${yyyy}-${mm}-${dd}`; 

    const currentTime = new Date().toLocaleTimeString();
    let pastEvent = null;

    if (currentDate > eventArray[i][1]) {
        pastEvent = true
    } else if (currentDate == eventArray[i][1] && currentTime.slice(0, 4) > formattedTime.slice(0, 4)) {
        // crude same-day time comparison; may need improvement for edge cases
        pastEvent = true
    } else {
        pastEvent = false
    }

    if (pastEvent === false) {
        currentEventSection.appendChild(eventBlock)
    } else {
        pastEventSection.appendChild(eventBlock)
    }

    // Give each event block an id that includes the index so the click
    // handler can locate the correct event data later (e.g. `event3`).
    eventBlock.id = `event${i}`
    console.log(eventBlock.id)
}


//opening past and current events on their respective tabs

pastEventSection.style.display = 'none'

const toggleBarUpcoming = document.querySelector('#togglebar1')
const toggleBarPast = document.querySelector('#togglebar2')

toggleBarUpcoming.addEventListener('click', () => {
    currentEventSection.style.display = 'block'
    pastEventSection.style.display = 'none'
    toggleBarUpcoming.style.backgroundColor = 'var(--Secondary-Background-Color)'
    toggleBarUpcoming.style.boxShadow = '5px 5px 8px #424242'
    toggleBarPast.style.backgroundColor = 'var(--Box-Color)'
    toggleBarPast.style.boxShadow = 'none'

})

toggleBarPast.addEventListener('click', () => {
    currentEventSection.style.display = 'none'
    pastEventSection.style.display = 'block'
    toggleBarPast.style.backgroundColor = 'var(--Secondary-Background-Color)'
    toggleBarPast.style.boxShadow = '5px 5px 8px #424242'
    toggleBarUpcoming.style.backgroundColor = 'var(--Box-Color)'
    toggleBarUpcoming.style.boxShadow = 'none'
})








//View event page code goes here vvv





// opening the view event page

const viewEvent = document.querySelector('#viewEvent')
const darkener = document.querySelector('#darkener')
const eventName = document.querySelector('#eventName')
const eventDate = document.querySelector('#viewEventDate')
const eventTime = document.querySelector('#viewEventTime')
const creatorsName = document.querySelector('#eventCreator')
const eventDescription = document.querySelector('#description')
const eventImage = document.querySelector('#eventImage')

document.addEventListener('click', (event) => {
    if(event.target.closest('.seeMore')) {
        viewEvent.style.display = 'block'
        darkener.style.display = 'block'
        let j = event.target.closest('.event').id[5]
        globalThis.l = j
        console.log(j)
        eventName.textContent = eventArray[j][0]
        eventDate.textContent = `${eventArray[j][1].slice(5, 7)}/${eventArray[j][1].slice(8, 10)}/${eventArray[j][1].slice(0, 4)}`
        let formattedStartTime = null
        if (eventArray[j][2].slice(0,2) == 12){
            formattedStartTime = `12:00 PM`
        } else if (eventArray[j][2].slice(0,2) == 00) {
            formattedstartTime = '12:00 AM'
        } else if (eventArray[j][2].slice(0,2) < 12) {
            formattedStartTime = `${eventArray[j][2]} AM`
        } else {
            formattedStartTime = `${eventArray[j][2].slice(0,2) - 12}:${eventArray[j][2].slice(3, 5)} PM`
        }

        let formattedEndTime = null
        if (eventArray[j][6].slice(0,2) == 12){
            formattedEndTime = `12:00 PM`
        } else if (eventArray[j][6].slice(0,2) == 00) {
            formattedEndTime = '12:00 AM'
        } else if (eventArray[j][6].slice(0,2) < 12) {
            formattedEndTime = `${eventArray[j][6]} AM`
        } else {
            formattedEndTime = `${eventArray[j][6].slice(0,2) - 12}:${eventArray[j][6].slice(3, 5)} PM`
        }

        eventTime.textContent = `${formattedStartTime} - ${formattedEndTime}`
        creatorsName.textContent = `Creator: ${eventArray[j][5]}`
        eventDescription.textContent = eventArray[j][3]
        eventImage.src = eventArray[j][4]
    } 

})

//closing the view event page
const exitButton = document.querySelector('#exit')

exitButton.addEventListener('click', () => {
    viewEvent.style.display = 'none'
    darkener.style.display = 'none'
})








//RSVPing


//initiating the participation array
let participantArray = []
for (i = 0; i < eventArray.length; i++) {
    let eventName = eventArray[i][0]
    participantArray[i] = []
    for (j = 0; j < 1; j++) {
        participantArray[i][j] = eventName
    }
}
console.log(participantArray)

const participantsButton = document.querySelector('#participants')
const participantContainer = document.querySelector('#participantList')

//RSVP saving names to array
const rsvpButton = document.querySelector('#signUp')
const isLoggedIn = sessionStorage.getItem('loggedIn')
console.log(isLoggedIn)

rsvpButton.addEventListener('click', () => {
    if (isLoggedIn == 'true') {
        const accountInfo = JSON.parse(sessionStorage.getItem('userInformation'))
        const userName = accountInfo[0]
        if (participantArray[l].includes(userName)) {
            alert('You are already signed up for this event')
            return
        } else {
            participantArray[l].push(userName)
            participantContainer.style.display = 'none'
            alert('You have successfully signed up for this event')
        }

        console.log(participantArray)
    }
    
})


//opening the participant list

participantsButton.addEventListener('click', () => {
    if (participantArray[l].length > 1) {
        if (participantContainer.style.display == 'none') {
            participantContainer.innerHTML = ''
            participantArray[l].slice(1).forEach(name => {
                const p = document.createElement('p');
                p.textContent = name;
                p.style.margin = "4px 0"; 
                participantContainer.appendChild(p);
                participantContainer.style.display = 'block'
            })
        } else {
            participantContainer.style.display = 'none'
        }
    } else {
        if (participantContainer.style.display == 'none') {
        participantContainer.innerHTML = ''
        const p = document.createElement('p');
        p.textContent = 'No one has signed up yet'
        p.style.margin = '4px 0'
        participantContainer.appendChild(p)
        participantContainer.style.display = 'block'
        } else {
            participantContainer.style.display = 'none'
        }
    }

})





//images section code goes below vvvvv




// opening the event images section

const openImageButton = document.querySelector('#viewImages')
const imageSection = document.querySelector('#eventImages')

openImageButton.addEventListener('click', () => {
    imageSection.style.display = 'block'
})

//exiting image section

const imageExit = document.querySelector('#exitImagesButton')

imageExit.addEventListener('click', () => {
    imageSection.style.display = 'none'
})


//function displaying the images on the image display

function openImages() {
    if (imageArray[l].length > 1) {
        imageArray[l].slice(1).forEach(image => {
            const img = document.createElement('img')
            img.src = image
            imageContainer.appendChild(img)
        })
    }
}

//creating the imageArray

let imageArray = []
for (i = 0; i < eventArray.length; i++) {
    let eventName = eventArray[i][0]
    imageArray[i] = []
    for (j = 0; j < 1; j++) {
        imageArray[i][j] = eventName
    }
}
console.log(imageArray)


//adding images to the array

const addImageButton = document.querySelector('#addImageButton')
const imageContainer = document.querySelector('#imageSection')
const imageInput = document.querySelector('#imageInput')

addImageButton.addEventListener('click', () => {
    console.log('add image clicked')
    const imageSrc = imageInput.files
    imageArray[l].push(imageSrc)
    console.log(imageArray)
    openImages
})


openImages