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
    const homeButton = document.querySelector("#homeButtonLink")
    const createButton = document.querySelector("#createEventButtonLink")
    const accountButton = document.querySelector("#profileButtonLink")
    const currentPage = window.location.href;
    if (currentPage === 'index.html') {
        homeButton.className = "fa-regular fa-house fa-xl"
        createButton.className = "fa-solid fa-circle-plus fa-xl"
        accountButton.className = "fa-solid fa-user fa-xl"
    } else if (currentPage === 'create-event.html') {
        homeButton.className = "fa-solid fa-house fa-xl"
        createButton.className = "fa-regular fa-circle-plus fa-xl"
        accountButton.className = "fa-solid fa-user fa-xl"
    } else if (currentPage === 'account-in.html') {
        homeButton.className = "fa-solid fa-house fa-xl"
        createButton.className = "fa-solid fa-circle-plus fa-xl"
        accountButton.className = "fa-regular fa-user fa-xl"
    }
}