


//i is y dimension. each row is a new user
//j is x dimension. column 0 = username, column 1 = password, column 2 = email, column 3 = phone number, column 4 = pfp, column 5 = school, column 6 = grade, column 7 = additional info, column 8 = role
let accountNumber = 4
let accounts = [];

for (let i = 0; i < accountNumber; i++) {
  accounts[i] = []; // Initialize the inner array (row)
  for (let j = 0; j < 9; j++) {
    accounts[i][j] = 0; // Fill each column index with a value
  }
}
accounts[0][0] = "Cyrus";
accounts[0][1] = "cyruspassword";
accounts[0][2] = "cyrusbai@gmail.com";
accounts[0][3] = "123-456-7890";
accounts[0][5] = "West High School";
accounts[0][6] = "12th";
accounts[0][7] = "I am a senior at a high school in the United States. I enjoy playing basketball and listening to music. In my free time, I like to read books and watch movies.";
accounts[0][8] = "Student";
accounts[1][0] = "Ryan";
accounts[1][1] = "123456";
accounts[1][2] = "ryan@gmail.com";
accounts[1][3] = "098-765-4321";
accounts[1][5] = "West High School";
accounts[1][6] = "11th";
accounts[1][7] = "I am a junior at a high school in the United States. I enjoy playing sports and listening to music. In my free time, I like to watch movies and hang out with friends.";
accounts[1][8] = "Student";
accounts[2][0] = "Matthew";
accounts[2][1] = "mathewpassword";
accounts[2][2] = "mathew@gmail.com";
accounts[2][3] = "555-1234";
accounts[2][5] = "West High School";
accounts[2][6] = "10th"
accounts[2][7] = "I am a sophomore at a high school in the United States. I enjoy playing basketball and reading novels. In my free time, I like to explore new places and try different foods."
accounts[2][8] = "Student"
// Demo administrator. Administrators approve the events that students create
// (see index.js). You can't pick this role when signing up.
accounts[3][0] = "Director";
accounts[3][1] = "directorpassword";
accounts[3][2] = "director@example.com";
accounts[3][3] = "555-0100";
accounts[3][5] = "Total Youth Productions";
accounts[3][6] = "Staff";
accounts[3][7] = "I help run Total Youth Productions and approve the events our members create.";
accounts[3][8] = "Administrator";
const demoAdministrator = accounts[3]


console.log(accounts);

// Persist accounts to localStorage so changes survive reloads
const saveAccounts = () => localStorage.setItem('accounts', JSON.stringify(accounts))
const loadAccounts = () => {
    const s = localStorage.getItem('accounts')
    const parsed = s ? JSON.parse(s) : null
    if (Array.isArray(parsed) && parsed.length > 0) {
        accounts = parsed
        // Accounts saved before administrators existed won't include one, so add the demo one
        if (!accounts.some(acc => Array.isArray(acc) && acc[8] === 'Administrator')) {
            accounts.push(demoAdministrator)
            saveAccounts()
        }
        accountNumber = accounts.length
    } else {
        // No stored accounts yet, or the stored list is empty (e.g. after
        // clearing localStorage while testing) — (re)save the built-in demo
        // accounts we created above so logins like Cyrus/Ryan/Matthew keep working.
        saveAccounts()
    }
}

// Expose a simple reset helper usable from the console: `resetAccounts()`
// Resets back to just the built-in demo accounts (Cyrus/Ryan/Matthew).
window.resetAccounts = () => {
    console.log('resetAccounts called')
    localStorage.removeItem('accounts')
    // Remove any stored user/session info
    localStorage.removeItem('userInformation')
    sessionStorage.removeItem('loggedIn')
    sessionStorage.clear()
    location.reload()
}

// Load stored accounts (overwrites defaults if present)
loadAccounts()

const logInButton = document.querySelector("#logInButton")
const usernameInput = document.querySelector("#logInUsername")
const passwordInput = document.querySelector("#loginPassword")
const passwordIncorrect = document.querySelector("#passwordIncorrect")

if (logInButton) logInButton.addEventListener('click', () => {
    if (!usernameInput || !passwordInput) return
    if (passwordIncorrect) passwordIncorrect.style.display = 'none'
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    console.log('login attempt for', username)

    let found = false
    for (let i = 0; i < accountNumber; i++) {
        if (accounts[i][0] === username) {
            found = true
            // password is stored at index 1 (see top comment)
            if (accounts[i][1] === password) {
                console.log('password correct')
                sessionStorage.setItem('loggedIn', 'true')
                sessionStorage.setItem('userInformation', JSON.stringify(accounts[i]))
                window.location.href = 'account-in.html'
                return
            } else {
                passwordIncorrect.textContent = 'Incorrect password.'
                passwordIncorrect.style.display = 'block'
                passwordIncorrect.style.color = 'red'
                return
            }
        }
    }

    if (!found) {
        passwordIncorrect.textContent = 'Username not found.'
        passwordIncorrect.style.display = 'block'
        passwordIncorrect.style.color = 'red'
    }
    console.log(accounts)
})



//adding a new user to the array when signing up

const signUpButton = document.querySelector("#signUpButton")
const newUsernameInput = document.querySelector("#newUsername")
const newEmailInput = document.querySelector("#newEmail")
const newPasswordInput = document.querySelector("#signupPassword")
const confirmPasswordInput = document.querySelector("#confirmPassword")
const newRoleInput = document.querySelector("#newRole")
const noUsername = document.querySelector("#noUsername")
const noEmail = document.querySelector("#noEmail")

if (signUpButton) signUpButton.addEventListener('click', () => {
    if (!newUsernameInput || !newEmailInput || !newPasswordInput || !confirmPasswordInput || !newRoleInput) return
    noUsername.style.display = 'none'
    noEmail.style.display = 'none'
    let stop = 0
    let newUsername = newUsernameInput.value.trim()
    let newEmail = newEmailInput.value.trim()
    let newPassword = newPasswordInput.value
    let confirmPassword = confirmPasswordInput.value
    let newRole = newRoleInput.value

    if (!newUsername || !newEmail || !newPassword) {
        alert('Please fill out all fields.')
        return
    }

    if (!newRole) {
        alert('Please select your role.')
        return
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.')
        return
    }

    for (let i=0; i < accountNumber; i++) {
        if (accounts[i][0] === newUsername) {
            noUsername.style.display = 'block'
            noUsername.style.color = 'red'
            stop = 1
        }
        // email is stored at index 2
        if (accounts[i][2] === newEmail) {
            noEmail.style.display = 'block'
            noEmail.style.color = 'red'
            stop = 1
        }
    }
    if (stop === 0) {
        // store as [username, password, email, phone, pfp, school, grade, info, role]
        let newUser = [newUsername, newPassword, newEmail, null, null, null, null, null, newRole]
        accounts.push(newUser)
        accountNumber++
        saveAccounts()
        console.log(accounts)

        // Log the new account in and send them to fill out the rest of their profile
        sessionStorage.setItem('loggedIn', 'true')
        sessionStorage.setItem('userInformation', JSON.stringify(newUser))
        window.location.href = 'edit-account.html'
    }
})

function togglePassword(passwordId, eyeId) {
    const passwordInput = document.getElementById(passwordId);
    const eye = document.getElementById(eyeId);

    if (!passwordInput) return

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        if (eye) {
            eye.classList.remove('fa-eye')
            eye.classList.add('fa-eye-slash')
        }
    } else {
        passwordInput.type = 'password'
        if (eye) {
            eye.classList.remove('fa-eye-slash')
            eye.classList.add('fa-eye')
        }
    }
}