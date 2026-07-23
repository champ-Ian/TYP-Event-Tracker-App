const eventArray = JSON.parse(localStorage.getItem('eventStorage'))
console.log(eventArray)

let eventAmount = eventArray.length
console.log(eventAmount)

for (i = 1; i <= eventAmount; i++) {
    const currentEventSection = document.querySelector('#currentEvents')

    const eventBlock = document.createElement('div');
    eventBlock.className = 'eventBlock'

    const eventName = document.createElement('h2');
    eventName.textContent = eventArray[i][0]

    const eventDate = document.createElement('h4');
    const formattedDate = `${eventArray[i][1].slice(5, 7)}/${eventArray[i][1].slice(8, 10)}/${eventArray[i][1].slice(0, 4)}`
    eventDate.textContent = formattedDate

    currentEventSection.appendChild(eventBlock)
    eventBlock.appendChild(eventName)
    eventBlock.appendChild(eventDate)
}