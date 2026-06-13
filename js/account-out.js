


//i is y dimension. each row is a new user
//j is x dimension. column 0 = username, column 1 = email, column 2 = password, column 3 = pfp, column 4 = bio
let accountNumber = 3
let accounts = [];

for (let i = 0; i < accountNumber; i++) {
  accounts[i] = []; // Initialize the inner array (row)
  for (let j = 0; j < 5; j++) {
    accounts[i][j] = 0; // Fill each column index with a value
  }
}
accounts[0][0] = "Cyrus";
accounts[0][2] = "cyruspassword";
accounts[0][4] = "My name is Cyrus and I'm very cool"
accounts[1][0] = "Ryan";
accounts[1][2] = "123456";
accounts[1][4] = "Ryan is very cool"
accounts[2][0] = "Matthew";
accounts[2][2] = "654321";
accounts[2][4] = "The individual who bears the name of Matthew is a highly intellectual being"


console.log(accounts);

const logInButton = document.querySelector("#logInButton")
const usernameInput = document.querySelector("#logInUsername")
const passwordInput = document.querySelector("#logInPassword")
const passwordIncorrect = document.querySelector("#passwordIncorrect")

logInButton.addEventListener('click', () => {
    let username = usernameInput.value;
    console.log(username)
    let password = passwordInput.value;
    console.log(password)

    for (let i = 0; i < accountNumber; i++)
        if (accounts[i][0] === username) {
            if (accounts[i][2] === password) {
                console.log("password correct");
                localStorage.setItem('loggedIn', true);
                window.location.href = 'account-in.html'
                localStorage.setItem('userInformation', JSON.stringify(accounts[i]))
            } else {
                passwordIncorrect.style.display = 'block'
                passwordIncorrect.style.color = 'red'
            }
        } else {
                passwordIncorrect.style.display = 'block'
                passwordIncorrect.style.color = 'red'
        }
    console.log(accounts)
    
})



//adding a new user to the array when signing up

const signUpButton = document.querySelector("#signUpButton")
const newUsernameInput = document.querySelector("#newUsername")
const newEmailInput = document.querySelector("#newEmail")
const newPasswordInput = document.querySelector("#newPassword")
const confirmPasswordInput = document.querySelector("#confirmPassword")
const noUsername = document.querySelector("#noUsername")
const noEmail = document.querySelector("#noEmail")

signUpButton.addEventListener('click', () => {
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
        if (accounts[i][1] === newEmail) {
            noEmail.style.display = 'block'
            noEmail.style.color = 'red'
            stop = 1
        }
    }
        let newUser = [newUsername, newEmail, newPassword, null, null]
        accounts.push(newUser)
        accountNumber++
        console.log(accounts)
})