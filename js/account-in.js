//updating the username, pfp, and bio depending on the user's information
const username = document.querySelector("#username")
const pfp = document.querySelector("#pfp")
const bio = document.querySelector("#acctBio")

const storedAccountInfo = localStorage.getItem('userInformation')
const userInfo = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];
username.textContent = userInfo[0]
console.log(userInfo)

bio.textContent = userInfo[4]





//When log out button is clicked, it logs out

const logOutButton = document.querySelector("#logout")

if (logOutButton) {
    logOutButton.addEventListener('click', () => {
        sessionStorage.setItem('loggedIn', false);
        window.location.href = 'account-out.html'
    })
} else {
    console.warn('Logout button not found')
}




//when edit button is clicked, the edit profile interface appears

const editButton = document.querySelector("#edits")

if (editButton) {
    editButton.addEventListener('click', () => {
        window.location.href = 'edit-account.html'
    })
} else {
    console.warn('Edit button not found')
}
