


//i is y dimension. each row is a new user
//j is x dimension. column 0 = username, column 1 = password, column 2 = email, column 3 = phone number, column 4 = pfp, column 5 = school, column 6 = grade, column 7 = additional info
let accountNumber = 3
let accounts = [];

for (let i = 0; i < accountNumber; i++) {
  accounts[i] = []; // Initialize the inner array (row)
  for (let j = 0; j < 8; j++) {
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
accounts[1][0] = "Ryan";
accounts[1][1] = "123456";
accounts[1][2] = "ryan@gmail.com";
accounts[1][3] = "098-765-4321";
accounts[1][5] = "West High School";
accounts[1][6] = "11th";
accounts[1][7] = "I am a junior at a high school in the United States. I enjoy playing sports and listening to music. In my free time, I like to watch movies and hang out with friends.";
accounts[2][0] = "Matthew";
accounts[2][1] = "mathewpassword";
accounts[2][2] = "mathew@gmail.com";
accounts[2][3] = "555-1234";
accounts[2][5] = "West High School";
accounts[2][6] = "10th"
accounts[2][7] = "I am a sophomore at a high school in the United States. I enjoy playing basketball and reading novels. In my free time, I like to explore new places and try different foods."


console.log(accounts);

// Persist accounts to localStorage so changes survive reloads
const saveAccounts = () => localStorage.setItem('accounts', JSON.stringify(accounts))
const loadAccounts = () => {
    const s = localStorage.getItem('accounts')
    if (s) {
        accounts = JSON.parse(s)
        accountNumber = accounts.length
    } else {
        // no stored accounts yet — save the defaults we created above
        saveAccounts()
    }
}

// Expose a simple reset helper usable from the console: `resetAccounts()`
window.resetAccounts = () => {
    console.log('resetAccounts called')
    // Replace stored accounts with an empty array so load won't repopulate defaults
    localStorage.setItem('accounts', JSON.stringify([]))
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
const noUsername = document.querySelector("#noUsername")
const noEmail = document.querySelector("#noEmail")

if (signUpButton) signUpButton.addEventListener('click', () => {
    if (!newUsernameInput || !newEmailInput || !newPasswordInput) return
    let stop = 0
    let newUsername = newUsernameInput.value
    let newEmail = newEmailInput.value
    let newPassword = newPasswordInput.value

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
        // store as [username, password, email, phone, pfp, school, grade, info]
        let newUser = [newUsername, newPassword, newEmail, null, null, null, null, null]
        accounts.push(newUser)
        accountNumber++
        saveAccounts()
        console.log(accounts)
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