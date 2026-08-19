if (!localStorage.getItem('didRun')) {
    const eventArray = [['Placeholder Event']]
    localStorage.setItem('eventStorage', JSON.stringify(eventArray))
    localStorage.setItem('didRun', 'true')
}

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

    if (!title || !date || !startTime || !endTime || !location) {
        alert('Please fill out all required fields.')
        return
    }

    if (personLoggedIn !== 'true') {
        alert('Please log in to create an event')
        return
    }

    const readFile = (file) => new Promise((resolve) => {
        if (!file) return resolve(null)
        const r = new FileReader()
        r.onload = (e) => resolve(e.target.result)
        r.onerror = () => resolve(null)
        r.readAsDataURL(file)
    })

    Promise.all([readFile(image), readFile(image2)]).then(([b64image, b64image2]) => {
        const stored = JSON.parse(localStorage.getItem('eventStorage') || '[]')
        // store as [title, date, startTime, description, image1, image2, eventCreator, endTime, location]
        stored.push([title, date, startTime, description, b64image, b64image2, eventCreator, endTime, location])
        localStorage.setItem('eventStorage', JSON.stringify(stored))
        alert('Your event has been successfully created')
        // clear form
        document.getElementById('title').value = ''
        document.getElementById('date').value = ''
        document.getElementById('start-time').value = ''
        document.getElementById('end-time').value = ''
        document.getElementById('location').value = ''
        document.getElementById('description').value = ''
        if (document.getElementById('image')) document.getElementById('image').value = null
        if (document.getElementById('image2')) document.getElementById('image2').value = null
    })
}

if (!sessionStorage.getItem('hasVisited')) {
    sessionStorage.setItem('loggedIn', 'false')
    sessionStorage.setItem('hasVisited', 'true')
}
