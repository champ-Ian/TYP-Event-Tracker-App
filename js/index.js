//when the account button in the navbar is clicked, which page to go to

const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = localStorage.getItem('loggedIn');
console.log(userLoggedIn)

profileButtonLink.addEventListener('click', () => {
    if (userLoggedIn == true) {
        window.location.href = 'account-in.html'
        console.log("yay")
    } else {
        window.location.href = 'account-out.html'
    }
})