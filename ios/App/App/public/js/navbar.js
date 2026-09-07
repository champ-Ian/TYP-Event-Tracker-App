//when the account button in the navbar is clicked, which page to go to

const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = sessionStorage.getItem('loggedIn');
console.log('this',userLoggedIn)

if (profileButtonLink) profileButtonLink.addEventListener('click', (event) => {
    event.preventDefault();
    const nowLoggedIn = sessionStorage.getItem('loggedIn')
    if (nowLoggedIn === "true") {
        window.location.href = 'account-in.html'
    } else {
        window.location.href = 'account-out.html'
    }
})


function checkNavBar() {
    const homeButton = document.querySelector("#houseButton")
    const createButton = document.querySelector("#createEventButton")
    const accountButton = document.querySelector("#profileButton")
    const currentPage = window.location.pathname;
    console.log(currentPage)
    if (currentPage === '/index.html') {
        if (homeButton) { homeButton.style.color = 'var(--dark)'; homeButton.style.backgroundColor = 'var(--light)'; }
    } else if (currentPage === '/create-event.html') {
        if (createButton) { createButton.style.color = 'var(--dark)'; createButton.style.backgroundColor = 'var(--light)'; }
    } else if (currentPage === '/account-in.html' || currentPage === '/account-out.html') {
        if (accountButton) { accountButton.style.color = 'var(--dark)'; accountButton.style.backgroundColor = 'var(--light)'; }
    }
}

checkNavBar();