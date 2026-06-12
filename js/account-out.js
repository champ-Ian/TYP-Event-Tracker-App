const profileButton = document.querySelector("#profileButton")
let logInBoolean = null
const profileButtonLink = document.querySelector("#profileButtonLink")

profileButton.addEventListener('click', () => {
    logInBoolean = prompt("are you logged in?", "type true or false")
    if (logInBoolean === "true") {
        profileButtonLink.href = 'account-in.html'
    } else {
        profileButtonLink.href = 'account-out.html'
    }
})

