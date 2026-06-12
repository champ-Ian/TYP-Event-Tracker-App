//When each icon in the Account navigation is clicked, it's associated page appears.

const myUpcomingEvents = document.querySelector("#myUpcomingEvents");
const myEventHistory = document.querySelector("#myEventHistory")
const myEvents = document.querySelector("#myEvents")
let upcomingEventsButton = document.querySelector("#upcomingEventsButton")
let eventHistoryButton = document.querySelector("#eventHistoryButton")
let myEventsButton = document.querySelector("#myEventsButton")

myUpcomingEvents.style.display = 'block'

upcomingEventsButton.addEventListener('click', () => {
    myUpcomingEvents.style.display = 'block';
    myEventHistory.style.display = 'none';
    myEvents.style.display = 'none';
    upcomingEventsButton.style.backgroundColor = 'var(--dark)'
    upcomingEventsButton.style.color = 'var(--light)'
    eventHistoryButton.style.backgroundColor = 'var(--light)'
    eventHistoryButton.style.color = 'var(--pitch)'
    myEventsButton.style.backgroundColor = 'var(--light)'
    myEventsButton.style.color = 'var(--pitch)'
})

eventHistoryButton.addEventListener('click', () => {
    myUpcomingEvents.style.display = 'none';
    myEventHistory.style.display = 'block';
    myEvents.style.display = 'none';
    upcomingEventsButton.style.backgroundColor = 'var(--light)'
    upcomingEventsButton.style.color = 'var(--pitch)'
    eventHistoryButton.style.backgroundColor = 'var(--dark)'
    eventHistoryButton.style.color = 'var(--light)'
    myEventsButton.style.backgroundColor = 'var(--light)'
    myEventsButton.style.color = 'var(--pitch)'
})

myEventsButton.addEventListener('click', () => {
    myUpcomingEvents.style.display = 'none';
    myEventHistory.style.display = 'none';
    myEvents.style.display = 'block';
    upcomingEventsButton.style.backgroundColor = 'var(--light)'
    upcomingEventsButton.style.color = 'var(--pitch)'
    eventHistoryButton.style.backgroundColor = 'var(--light)'
    eventHistoryButton.style.color = 'var(--pitch)'
    myEventsButton.style.backgroundColor = 'var(--dark)'
    myEventsButton.style.color = 'var(--light)'
})





//When log out button is clicked, it logs out
const logOutButton = document.querySelector("#logOut")

logOutButton.addEventListener('click', () => {
    localStorage.setItem('loggedIn', false);
    window.location.href = 'account-out.html'
})