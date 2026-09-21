//updating the username, pfp, school, grade, and bio depending on the user's information
// account record shape: [username, password, email, phone, pfp, school, grade, bio]
const username = document.querySelector("#username")
const pfp = document.querySelector("#pfp")
const school = document.querySelector("#school")
const grade = document.querySelector("#grade")
const bio = document.querySelector("#acctBio")

const storedAccountInfo = sessionStorage.getItem('userInformation')
const userInfo = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];
console.log(userInfo)

// If we're not actually logged in, don't show a (possibly stale) profile
// left over from a previous session on this page - send the user to log in.
if (sessionStorage.getItem('loggedIn') !== 'true' || !userInfo[0]) {
    window.location.href = 'account-out.html'
} else {
    username.textContent = userInfo[0]
    if (pfp && userInfo[4]) pfp.src = userInfo[4]
    if (school) school.textContent = userInfo[5] || 'N/A'
    if (grade) grade.textContent = userInfo[6] || 'N/A'
    bio.textContent = userInfo[7] || 'No bio yet.'
}





//When log out button is clicked, it logs out

const logOutButton = document.querySelector("#logoutButton")

if (logOutButton) {
    logOutButton.addEventListener('click', () => {
        sessionStorage.setItem('loggedIn', 'false');
        sessionStorage.removeItem('userInformation');
        window.location.href = 'account-out.html'
    })
} else {
    console.warn('Logout button not found')
}




//when edit button is clicked, the edit profile interface appears

const editButton = document.querySelector("#editButton")

if (editButton) {
    editButton.addEventListener('click', () => {
        window.location.href = 'edit-account.html'
    })
} else {
    console.warn('Edit button not found')
}
