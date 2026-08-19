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
if (currentEventSection && pastEventSection) {
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



    // Validate event record shape before using fields
    if (!eventArray[i] || !Array.isArray(eventArray[i]) || typeof eventArray[i][1] !== 'string' || typeof eventArray[i][2] !== 'string') {
        console.warn(`Skipping malformed event at index ${i}`, eventArray[i])
        continue
    }

    // Event title is stored at index 0 of the event array
    const eventName = document.createElement('h2');
    eventName.textContent = eventArray[i][0] || 'Untitled Event'
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
    const startHour = parseInt(eventArray[i][2].slice(0,2), 10)
    if (startHour === 12){
        formattedStartTime = `12:00 PM`
    } else if (startHour === 0) {
        formattedStartTime = '12:00 AM'
    } else if (startHour < 12) {
        formattedStartTime = `${eventArray[i][2]} AM`
    } else {
        formattedStartTime = `${startHour - 12}:${eventArray[i][2].slice(3, 5)} PM`
    }

    let formattedEndTime = ''
    // end time is stored at index 7 in the event record; guard if missing
    if (eventArray[i][7]) {
        const endHour = parseInt(eventArray[i][7].slice(0,2), 10)
        if (endHour === 12) {
            formattedEndTime = `12:00 PM`
        } else if (endHour === 0) {
            formattedEndTime = '12:00 AM'
        } else if (endHour < 12) {
            formattedEndTime = `${eventArray[i][7]} AM`
        } else {
            formattedEndTime = `${endHour - 12}:${eventArray[i][7].slice(3, 5)} PM`
        }
    } else {
        formattedEndTime = ''
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
} else {
    console.warn('Upcoming/past event sections not found in DOM; skipping event rendering')
}


//opening past and current events on their respective tabs

if (pastEventSection) pastEventSection.style.display = 'none'

const toggleBarUpcoming = document.querySelector('#togglebar1')
const toggleBarPast = document.querySelector('#togglebar2')

if (toggleBarUpcoming) toggleBarUpcoming.addEventListener('click', () => {
    if (currentEventSection) currentEventSection.style.display = 'block'
    if (pastEventSection) pastEventSection.style.display = 'none'
    toggleBarUpcoming.style.backgroundColor = 'var(--Secondary-Background-Color)'
    toggleBarUpcoming.style.boxShadow = '5px 5px 8px #424242'
    if (toggleBarPast) toggleBarPast.style.backgroundColor = 'var(--Box-Color)'
    if (toggleBarPast) toggleBarPast.style.boxShadow = 'none'

})

if (toggleBarPast) toggleBarPast.addEventListener('click', () => {
    if (currentEventSection) currentEventSection.style.display = 'none'
    if (pastEventSection) pastEventSection.style.display = 'block'
    toggleBarPast.style.backgroundColor = 'var(--Secondary-Background-Color)'
    toggleBarPast.style.boxShadow = '5px 5px 8px #424242'
    if (toggleBarUpcoming) toggleBarUpcoming.style.backgroundColor = 'var(--Box-Color)'
    if (toggleBarUpcoming) toggleBarUpcoming.style.boxShadow = 'none'
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

if (viewEvent && darkener && eventName && eventDate && eventTime && creatorsName && eventDescription && eventImage) {
    document.addEventListener('click', (event) => {
        const seeMoreEl = event.target.closest('.seeMore')
        if(seeMoreEl) {
            const eventEl = seeMoreEl.closest('.event')
            if (!eventEl) return
            const idStr = eventEl.id || ''
            const idx = parseInt(idStr.replace('event',''), 10)
            if (Number.isNaN(idx) || !eventArray[idx]) return

            viewEvent.style.display = 'block'
            darkener.style.display = 'block'
            globalThis.l = idx
            console.log(idx)

            eventName.textContent = eventArray[idx][0] || 'Untitled Event'
            if (eventArray[idx][1]) {
                eventDate.textContent = `${eventArray[idx][1].slice(5, 7)}/${eventArray[idx][1].slice(8, 10)}/${eventArray[idx][1].slice(0, 4)}`
            } else {
                eventDate.textContent = ''
            }

            let formattedStartTime = ''
            if (eventArray[idx][2]) {
                const sh = parseInt(eventArray[idx][2].slice(0,2), 10)
                if (sh === 12) formattedStartTime = '12:00 PM'
                else if (sh === 0) formattedStartTime = '12:00 AM'
                else if (sh < 12) formattedStartTime = `${eventArray[idx][2]} AM`
                else formattedStartTime = `${sh - 12}:${eventArray[idx][2].slice(3,5)} PM`
            }

            let formattedEndTime = ''
            if (eventArray[idx][7]) {
                const eh = parseInt(eventArray[idx][7].slice(0,2), 10)
                if (eh === 12) formattedEndTime = '12:00 PM'
                else if (eh === 0) formattedEndTime = '12:00 AM'
                else if (eh < 12) formattedEndTime = `${eventArray[idx][7]} AM`
                else formattedEndTime = `${eh - 12}:${eventArray[idx][7].slice(3,5)} PM`
            }

            eventTime.textContent = `${formattedStartTime} - ${formattedEndTime}`
            creatorsName.textContent = `Creator: ${eventArray[idx][6] || 'Unknown'}`
            eventDescription.textContent = eventArray[idx][3] || ''
            if (eventArray[idx][4]) eventImage.src = eventArray[idx][4]
        }
    })
} else {
    console.warn('View event elements not found; skipping view handlers')
}

//closing the view event page
const exitButton = document.querySelector('#exit')
if (exitButton) exitButton.addEventListener('click', () => {
    if (viewEvent) viewEvent.style.display = 'none'
    if (darkener) darkener.style.display = 'none'
})








//RSVPing


//initiating the participation array
let participantArray = []
for (let i = 0; i < eventArray.length; i++) {
    const eventName = eventArray[i] && eventArray[i][0] ? eventArray[i][0] : ''
    participantArray[i] = []
    participantArray[i][0] = eventName
}
console.log(participantArray)

const participantsButton = document.querySelector('#participants')
const participantContainer = document.querySelector('#participantList')

//RSVP saving names to array
const rsvpButton = document.querySelector('#signUp')
const isLoggedIn = sessionStorage.getItem('loggedIn')
console.log(isLoggedIn)

if (rsvpButton) rsvpButton.addEventListener('click', () => {
    const isLoggedInNow = sessionStorage.getItem('loggedIn')
    if (isLoggedInNow == 'true') {
        const accountInfo = JSON.parse(sessionStorage.getItem('userInformation'))
        const userName = accountInfo ? accountInfo[0] : null
        if (!userName) return
        if (!Number.isInteger(globalThis.l) || !participantArray[globalThis.l]) return
        if (participantArray[globalThis.l].includes(userName)) {
            alert('You are already signed up for this event')
            return
        } else {
            participantArray[globalThis.l].push(userName)
            if (participantContainer) participantContainer.style.display = 'none'
            alert('You have successfully signed up for this event')
        }

        console.log(participantArray)
    }
    
})


//opening the participant list

if (participantsButton) participantsButton.addEventListener('click', () => {
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

if (openImageButton) openImageButton.addEventListener('click', () => {
    if (imageSection) imageSection.style.display = 'block'
})

//exiting image section

const imageExit = document.querySelector('#exitImagesButton')

if (imageExit) imageExit.addEventListener('click', () => {
    if (imageSection) imageSection.style.display = 'none'
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
for (let i = 0; i < eventArray.length; i++) {
    const eventName = eventArray[i] && eventArray[i][0] ? eventArray[i][0] : ''
    imageArray[i] = []
    imageArray[i][0] = eventName
}
console.log(imageArray)


//adding images to the array

const addImageButton = document.querySelector('#addImageButton')
const imageContainer = document.querySelector('#imageSection')
const imageInput = document.querySelector('#imageInput')

if (addImageButton) addImageButton.addEventListener('click', () => {
    console.log('add image clicked')
    if (!imageInput || !imageInput.files) return
    const imageSrc = imageInput.files[0]
    if (!Number.isInteger(globalThis.l)) return
    if (!imageArray[globalThis.l]) imageArray[globalThis.l] = []
    imageArray[globalThis.l].push(imageSrc)
    console.log(imageArray)
    openImages()
})


if (typeof openImages === 'function') openImages()