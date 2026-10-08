if (!localStorage.getItem('didRun')) {
    const eventArray = [['Placeholder Event']]
    localStorage.setItem('eventStorage', JSON.stringify(eventArray))
    localStorage.setItem('didRun', 'true')
}

// If we were sent here to edit an existing event (see index.js's Edit button),
// figure that out once up front and pre-fill the form. The index is "consumed"
// immediately so a later, unrelated visit to this page doesn't stay in edit mode.
let editIndex = null
let existingImage1 = null
let existingImage2 = null

;(function loadEditTarget() {
    const raw = sessionStorage.getItem('editEventIndex')
    sessionStorage.removeItem('editEventIndex')
    if (raw === null) return

    const idx = parseInt(raw, 10)
    const stored = JSON.parse(localStorage.getItem('eventStorage') || '[]')
    const event = stored[idx]
    if (Number.isNaN(idx) || !event) return

    // Only the event's own creator may edit it - re-check here too, not just
    // in the UI that shows the Edit button, in case of stale/tampered state.
    const userInfo = JSON.parse(sessionStorage.getItem('userInformation') || 'null')
    const currentUsername = userInfo && userInfo[0] ? userInfo[0] : null
    if (!currentUsername || event[6] !== currentUsername) return

    editIndex = idx
    existingImage1 = event[4] || null
    existingImage2 = event[5] || null

    document.getElementById('title').value = event[0] || ''
    document.getElementById('date').value = event[1] || ''
    document.getElementById('start-time').value = event[2] || ''
    document.getElementById('description').value = event[3] || ''
    document.getElementById('end-time').value = event[7] || ''
    document.getElementById('location').value = event[8] || ''

    const heading = document.getElementById('formHeading')
    if (heading) heading.textContent = 'Edit Event'
    const submitButton = document.getElementById('submitEventButton')
    if (submitButton) submitButton.textContent = 'Save Changes'

    const image1Name = document.getElementById('image-name')
    if (image1Name && existingImage1) image1Name.textContent = 'Current photo (choose a file to replace)'
    const image2Name = document.getElementById('image2-name')
    if (image2Name && existingImage2) image2Name.textContent = 'Current photo (choose a file to replace)'
})()

function newEvent() {
    // read current session state and user info
    const personLoggedIn = sessionStorage.getItem('loggedIn')
    const userInfo = JSON.parse(sessionStorage.getItem('userInformation') || 'null')

    const title = document.getElementById('title')?.value.trim();
    const date = document.getElementById('date')?.value;
    const startTime = document.getElementById('start-time')?.value;
    const endTime = document.getElementById('end-time')?.value;
    const location = document.getElementById('location')?.value.trim();
    const description = document.getElementById('description')?.value.trim();
    const image = document.getElementById('image')?.files[0];
    const image2 = document.getElementById('image2')?.files[0];
    const eventCreator = userInfo && userInfo[0] ? userInfo[0] : 'Anonymous'
    // Administrators' events go live right away; everyone else's wait for approval
    const isAdmin = !!userInfo && userInfo[8] === 'Administrator'
    const status = isAdmin ? 'approved' : 'pending'

    if (!title || !date || !startTime || !endTime || !location) {
        alert('Please fill out all required fields.')
        return
    }

    if (endTime <= startTime) {
        alert('End time must be after start time.')
        return
    }

    if (personLoggedIn !== 'true') {
        alert('Please log in to create an event')
        return
    }

    Promise.all([
        image ? compressImage(image) : Promise.resolve(existingImage1),
        image2 ? compressImage(image2) : Promise.resolve(existingImage2)
    ]).then(([b64image, b64image2]) => {
        const stored = JSON.parse(localStorage.getItem('eventStorage') || '[]')
        // store as [title, date, startTime, description, image1, image2, eventCreator, endTime, location, status]
        // status is 'pending', 'approved' or 'rejected' (see the approval code in index.js)
        const record = [title, date, startTime, description, b64image, b64image2, eventCreator, endTime, location, status]

        if (editIndex !== null && stored[editIndex]) {
            // Keep the original creator, regardless of who's currently logged in
            record[6] = stored[editIndex][6]
            stored[editIndex] = record
            localStorage.setItem('eventStorage', JSON.stringify(stored))
            alert(isAdmin ? 'Your event has been successfully updated' : 'Your changes were sent to an administrator for approval')
            window.location.href = 'index.html'
            return
        }

        stored.push(record)
        localStorage.setItem('eventStorage', JSON.stringify(stored))
        alert(isAdmin ? 'Your event has been successfully created' : 'Your event was sent to an administrator for approval')
        // clear form
        document.getElementById('title').value = ''
        document.getElementById('date').value = ''
        document.getElementById('start-time').value = ''
        document.getElementById('end-time').value = ''
        document.getElementById('location').value = ''
        document.getElementById('description').value = ''
        if (document.getElementById('image')) document.getElementById('image').value = null
        if (document.getElementById('image2')) document.getElementById('image2').value = null
        updateFileName('image', 'image-name')
        updateFileName('image2', 'image2-name')
    })
}

function updateFileName(inputId, nameId) {
    const input = document.getElementById(inputId)
    const name = document.getElementById(nameId)
    if (!input || !name) return
    name.textContent = input.files[0]?.name || 'No File Selected'
}

document.getElementById('image')?.addEventListener('change', () => updateFileName('image', 'image-name'))
document.getElementById('image2')?.addEventListener('change', () => updateFileName('image2', 'image2-name'))

function clearFile(inputId, nameId) {
    const input = document.getElementById(inputId)
    if (!input) return
    input.value = ''
    updateFileName(inputId, nameId)
}

document.getElementById('image-clear')?.addEventListener('click', () => clearFile('image', 'image-name'))
document.getElementById('image2-clear')?.addEventListener('click', () => clearFile('image2', 'image2-name'))
