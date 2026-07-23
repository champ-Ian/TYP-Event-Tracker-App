const eventArray = JSON.parse(localStorage.getItem('eventStorage'))
console.log(eventArray)

let eventAmount = eventArray.length

for (i = 1; i <= eventAmount; i++) {
    const currentEventSection = document.querySelector('#currentEvents')
    const pastEventSection = document.querySelector('#pastEvents')

    const eventBlock = document.createElement('div');
    eventBlock.className = 'eventBlock'

    const eventName = document.createElement('h2');
    eventName.textContent = eventArray[i][0]

    const eventDate = document.createElement('h4');
    const formattedDate = `${eventArray[i][1].slice(5, 7)}/${eventArray[i][1].slice(8, 10)}/${eventArray[i][1].slice(0, 4)}`
    eventDate.textContent = formattedDate

    const eventTime = document.createElement('h4');
    let formattedTime = null
    if (eventArray[i][2].slice(0,2) == 12){
        formattedTime = `12:00 PM`
    } else if (eventArray[i][2].slice(0,2) == 00) {
        formattedTime = '12:00 AM'
    } else if (eventArray[i][2].slice(0,2) < 12) {
        formattedTime = `${eventArray[i][2]} AM`
    } else {
        formattedTime = `${eventArray[i][2].slice(0,2) - 12}:${eventArray[i][2].slice(3, 5)} PM`
    }
    eventTime.textContent = formattedTime

    const eventDesc = document.createElement('p');
    eventDesc.textContent = eventArray[i][3];

    eventBlock.appendChild(eventName)
    eventBlock.appendChild(eventDate)
    eventBlock.appendChild(eventTime)
    eventBlock.appendChild(eventDesc)

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
        pastEvent = true
    } else {
        pastEvent = false
    }

    if (pastEvent === false) {
            currentEventSection.appendChild(eventBlock)
    } else {
        pastEventSection.appendChild(eventBlock)
    }
}