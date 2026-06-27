//when the account button in the navbar is clicked, which page to go to

const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = localStorage.getItem('loggedIn');
console.log(userLoggedIn)

profileButtonLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (userLoggedIn === "true") {
        window.location.href = 'account-in.html'
    } else {
        window.location.href = 'account-out.html'
    }
})

if (!sessionStorage.getItem('hasVisited')) {
    localStorage.setItem('loggedIn', false)
  console.log("Welcome! This is your very first time here in this session.");
  
  // Set the flag so this block won't run again on reload
  sessionStorage.setItem('hasVisited', 'true');
} else {
  console.log("Page has been reloaded or navigated to previously.");
}

function checkNavBar() {
    const homeButton = document.querySelector("#houseButton")
    const createButton = document.querySelector("#createEventButton")
    const accountButton = document.querySelector("#profileButton")
    const currentPage = window.location.pathname;
    console.log(currentPage)
    if (currentPage === '/index.html') {
        homeButton.style.color = 'var(--dark)'
        homeButton.style.backgroundColor = 'var(--light)'
    } else if (currentPage === '/create-event.html') {
        createButton.style.color = 'var(--dark)'
        createButton.style.backgroundColor = 'var(--light)'
    } else if (currentPage === '/account-in.html' || currentPage === '/account-out.html') {
        accountButton.style.color = 'var(--dark)'
        accountButton.style.backgroundColor = 'var(--light)'
    }
}

checkNavBar();