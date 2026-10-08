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






// Approval pipeline: a student creates an event, it waits as 'pending', and an
// administrator approves it before everyone else can see it. The status is
// stored at index 9 of the event record. Events saved before this existed
// have no status, so they count as approved.
function getEventStatus(event) {
    return (event && event[9]) || 'approved'
}

// The logged-in user's account record, or null when nobody is logged in
function getCurrentUser() {
    if (sessionStorage.getItem('loggedIn') !== 'true') return null
    try {
        const info = JSON.parse(sessionStorage.getItem('userInformation') || 'null')
        return Array.isArray(info) && info[0] ? info : null
    } catch (e) {
        return null
    }
}

const currentUser = getCurrentUser()
const currentUsername = currentUser ? currentUser[0] : null
const userIsAdmin = !!currentUser && currentUser[8] === 'Administrator'

// Select the sections in the page where upcoming and past events will be
// appended. These match the markup in `index.html` (`.upcomingEvents`/`.pastEvents`).
const currentEventSection = document.querySelector('.upcomingEvents')
const pastEventSection = document.querySelector('.pastEvents')
const pendingEventSection = document.querySelector('.pendingEvents')
let pendingCount = 0

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



    // Validate event record shape before using fields
    if (!eventArray[i] || !Array.isArray(eventArray[i]) || typeof eventArray[i][1] !== 'string' || typeof eventArray[i][2] !== 'string') {
        console.warn(`Skipping malformed event at index ${i}`, eventArray[i])
        continue
    }

    // Only approved events are public. A pending event is also shown to its
    // creator and to administrators, and a rejected one only to its creator.
    const status = getEventStatus(eventArray[i])
    const isMine = !!currentUsername && eventArray[i][6] === currentUsername
    if (status === 'pending' && !isMine && !userIsAdmin) continue
    if (status === 'rejected' && !isMine) continue

    // Event title is stored at index 0 of the event array
    const eventName = document.createElement('h2');
    eventName.textContent = eventArray[i][0] || 'Untitled Event'
    eventName.className = 'eventTitle'

    if (status !== 'approved') {
        const badge = document.createElement('span')
        badge.className = `statusBadge ${status}`
        badge.textContent = status === 'pending' ? 'Pending approval' : 'Not approved'
        eventName.appendChild(badge)
    }

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

    if (status === 'pending' && userIsAdmin && pendingEventSection) {
        // administrators review pending events on their own tab
        pendingEventSection.appendChild(eventBlock)
        pendingCount++
    } else if (pastEvent === false) {
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
if (pendingEventSection) pendingEventSection.style.display = 'none'

const toggleBarUpcoming = document.querySelector('#togglebar1')
const toggleBarPast = document.querySelector('#togglebar2')
const toggleBarPending = document.querySelector('#togglebar3')

// Each tab paired with the section it shows
const tabs = [
    [toggleBarUpcoming, currentEventSection],
    [toggleBarPast, pastEventSection],
    [toggleBarPending, pendingEventSection]
]

function showTab(activeBar) {
    tabs.forEach(([bar, section]) => {
        const active = bar === activeBar
        if (section) section.style.display = active ? 'block' : 'none'
        if (bar) bar.style.backgroundColor = active ? 'var(--light)' : 'white'
        if (bar) bar.style.boxShadow = active ? '5px 5px 8px #424242' : 'none'
    })
}

tabs.forEach(([bar]) => {
    if (bar) bar.addEventListener('click', () => showTab(bar))
})

// The Pending tab only exists for administrators
if (userIsAdmin && toggleBarPending && pendingEventSection) {
    toggleBarPending.hidden = false
    document.querySelector('#toggleBar')?.classList.add('hasPendingTab')
    const pendingTabLabel = document.querySelector('#pendingTabLabel')
    if (pendingTabLabel) pendingTabLabel.textContent = `Pending (${pendingCount})`
    if (pendingCount === 0) {
        const p = document.createElement('p')
        p.className = 'pendingEmpty'
        p.textContent = 'No events are waiting for approval.'
        pendingEventSection.appendChild(p)
    }
}








//View event page code goes here vvv





// opening the view event page

const viewEvent = document.querySelector('#viewEvent')
const darkener = document.querySelector('#darkener')
const eventName = document.querySelector('#eventName')
const eventDate = document.querySelector('#viewEventDate')
const eventTime = document.querySelector('#viewEventTime')
const eventLocation = document.querySelector('#viewEventLocation')
const creatorsName = document.querySelector('#eventCreator')
const creatorImage = document.querySelector('#creatorImage')
const editEventButton = document.querySelector('#editEventButton')
const eventDescription = document.querySelector('#description')

// Look up a stored account by username so we can show the event creator's own profile picture
function getAccountByUsername(username) {
    try {
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]')
        return Array.isArray(accounts) ? accounts.find(acc => Array.isArray(acc) && acc[0] === username) : null
    } catch (e) {
        return null
    }
}

if (viewEvent && darkener && eventName && eventDate && eventTime && creatorsName && eventDescription) {
    document.addEventListener('click', (event) => {
        // Clicking anywhere on the card opens it, not just the "See More" button
        const eventEl = event.target.closest('.event')
        if(eventEl) {
            const idStr = eventEl.id || ''
            const idx = parseInt(idStr.replace('event',''), 10)
            if (Number.isNaN(idx) || !eventArray[idx]) return

            viewEvent.style.display = 'flex'
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
            if (eventLocation) eventLocation.textContent = eventArray[idx][8] || 'No location set'

            const creatorUsername = eventArray[idx][6] || 'Unknown'
            const creatorAccount = getAccountByUsername(creatorUsername)
            const creatorRole = creatorAccount && creatorAccount[8] ? ` (${creatorAccount[8]})` : ''
            creatorsName.textContent = `Created by ${creatorUsername}${creatorRole}`
            if (creatorImage) creatorImage.src = (creatorAccount && creatorAccount[4]) ? creatorAccount[4] : 'img/anonymous pfp.webp'

            // Only the event's own creator can edit it
            if (editEventButton) {
                let loggedInUsername = null
                try {
                    const info = JSON.parse(sessionStorage.getItem('userInformation') || 'null')
                    loggedInUsername = info ? info[0] : null
                } catch (e) {}
                const isOwner = sessionStorage.getItem('loggedIn') === 'true' && loggedInUsername && loggedInUsername === creatorUsername
                editEventButton.hidden = !isOwner
            }

            eventDescription.textContent = eventArray[idx][3] || ''

            updateApprovalRow(idx)
            renderParticipants(idx)
            openImages()

            // Reset any leftover file selection from a previously viewed event
            if (imageInput) imageInput.value = ''
            if (imageInputName) imageInputName.textContent = 'No File Selected'
            if (addImageButton) addImageButton.hidden = true
        }
    })
} else {
    console.warn('View event elements not found; skipping view handlers')
}

//approval status of the currently viewed event, plus the administrator's Approve/Reject buttons
const approvalRow = document.querySelector('#approvalRow')
const approvalStatus = document.querySelector('#approvalStatus')
const approvalButtons = document.querySelector('#approvalButtons')
const approveEventButton = document.querySelector('#approveEventButton')
const rejectEventButton = document.querySelector('#rejectEventButton')

function updateApprovalRow(idx) {
    const status = getEventStatus(eventArray[idx])
    // You can only RSVP to an event once it has been approved
    const rsvp = document.querySelector('#signUp')
    if (rsvp) rsvp.hidden = status !== 'approved'
    if (!approvalRow || !approvalStatus) return

    approvalRow.hidden = status === 'approved'
    approvalRow.classList.toggle('rejected', status === 'rejected')
    if (status === 'pending') {
        approvalStatus.textContent = userIsAdmin ? 'This event is waiting for your approval.' : 'Waiting for an administrator to approve this event.'
    } else if (status === 'rejected') {
        approvalStatus.textContent = 'An administrator did not approve this event. Edit it to send it for approval again.'
    }
    if (approvalButtons) approvalButtons.hidden = !(userIsAdmin && status === 'pending')
}

function setEventStatus(idx, status) {
    // Re-check here too, not just in the UI that shows the buttons
    if (!userIsAdmin || !eventArray[idx]) return
    eventArray[idx][9] = status
    localStorage.setItem('eventStorage', JSON.stringify(eventArray))
    alert(status === 'approved' ? 'Event approved. Everyone can see it now.' : 'Event was not approved.')
    location.reload()
}

if (approveEventButton) approveEventButton.addEventListener('click', () => setEventStatus(globalThis.l, 'approved'))
if (rejectEventButton) rejectEventButton.addEventListener('click', () => setEventStatus(globalThis.l, 'rejected'))

//editing the currently viewed event (only shown for its creator)
if (editEventButton) editEventButton.addEventListener('click', () => {
    if (!Number.isInteger(globalThis.l)) return
    sessionStorage.setItem('editEventIndex', String(globalThis.l))
    window.location.href = 'create-event.html'
})

//closing the view event page
const exitButton = document.querySelector('#exit')
if (exitButton) exitButton.addEventListener('click', () => {
    if (viewEvent) viewEvent.style.display = 'none'
    if (darkener) darkener.style.display = 'none'
})

//closing the view event page by clicking outside of it
if (darkener) darkener.addEventListener('click', () => {
    if (viewEvent) viewEvent.style.display = 'none'
    darkener.style.display = 'none'
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
            renderParticipants(globalThis.l)
            alert('You have successfully signed up for this event')
        }

        console.log(participantArray)
    } else {
        alert('You must be logged in to RSVP.')
    }

})


//always showing the participant list for the currently viewed event

function renderParticipants(idx) {
    if (!participantContainer) return
    participantContainer.innerHTML = ''
    const names = (participantArray[idx] || []).slice(1)
    if (names.length === 0) {
        const p = document.createElement('p')
        p.textContent = 'No one has signed up yet'
        participantContainer.appendChild(p)
        return
    }
    names.forEach(name => {
        const p = document.createElement('p')
        p.textContent = name
        participantContainer.appendChild(p)
    })
}





//images section code goes below vvvvv
//the gallery is now always visible inside the main popup instead of a separate popup


//function displaying the images on the image display

// Lets the user save an image to their Photos library via the native share
// sheet (works without any extra native plugin). Falls back to opening the
// image in a new tab, where a long-press still offers "Save to Photos".
async function saveImageToPhotos(dataUrl) {
    try {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], 'event-image.jpg', { type: blob.type || 'image/jpeg' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] })
        } else {
            window.open(dataUrl, '_blank')
        }
    } catch (e) {
        console.error('Failed to save image', e)
    }
}

function openImages() {
    if (!imageContainer || !Number.isInteger(globalThis.l) || !imageArray[globalThis.l]) return
    imageContainer.innerHTML = ''
    const images = imageArray[globalThis.l].slice(1)
    if (images.length === 0) {
        const p = document.createElement('p')
        p.className = 'emptyState'
        p.textContent = 'No images yet.'
        imageContainer.appendChild(p)
        return
    }
    images.forEach(image => {
        const thumb = document.createElement('div')
        thumb.className = 'imageThumb'

        const img = document.createElement('img')
        img.src = image
        thumb.appendChild(img)

        const saveBtn = document.createElement('button')
        saveBtn.type = 'button'
        saveBtn.className = 'saveImageButton'
        saveBtn.setAttribute('aria-label', 'Save image to Photos')
        saveBtn.innerHTML = '<i class="fa-solid fa-download"></i>'
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            saveImageToPhotos(image)
        })
        thumb.appendChild(saveBtn)

        imageContainer.appendChild(thumb)
    })
}

//creating the imageArray, seeded with any images the event was created with

let imageArray = []
for (let i = 0; i < eventArray.length; i++) {
    const eventName = eventArray[i] && eventArray[i][0] ? eventArray[i][0] : ''
    imageArray[i] = [eventName]
    if (eventArray[i] && eventArray[i][4]) imageArray[i].push(eventArray[i][4])
    if (eventArray[i] && eventArray[i][5]) imageArray[i].push(eventArray[i][5])
}
console.log(imageArray)


//adding images to the array

const addImageButton = document.querySelector('#addImageButton')
const imageContainer = document.querySelector('#imageSection')
const imageInput = document.querySelector('#imageInput')
const imageInputName = document.querySelector('#imageInput-name')

if (imageInput) imageInput.addEventListener('change', () => {
    const hasFile = !!imageInput.files[0]
    if (imageInputName) imageInputName.textContent = imageInput.files[0]?.name || 'No File Selected'
    if (addImageButton) addImageButton.hidden = !hasFile
})

if (addImageButton) addImageButton.addEventListener('click', () => {
    console.log('add image clicked')
    if (!Number.isInteger(globalThis.l) || !imageArray[globalThis.l]) return
    const imageSrc = imageInput.files[0]
    if (imageSrc) {
        compressImage(imageSrc).then((dataUrl) => {
            if (!dataUrl) return
            imageArray[globalThis.l].push(dataUrl)
            openImages()
            imageInput.value = ''
            if (imageInputName) imageInputName.textContent = 'No File Selected'
            addImageButton.hidden = true
        })

        console.log(imageArray)

    }

})


if (typeof openImages === 'function') openImages()