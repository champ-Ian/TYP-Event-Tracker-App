const profileButton = document.querySelector("#profileButton")
const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = localStorage.getItem('loggedIn');
console.log(userLoggedIn)

profileButton.addEventListener('click', () => {
    if (userLoggedIn == true) {
        window.location.href = 'account-in.html'
    } else {
        window.location.href = 'account-out.html'
    }
})


//i is y dimension. each row is a new user
//j is x dimension. column 1 = username, column 2 = email, column 3 = password, column 4 = pfp, column 5 = bio
let accountNumber = 3
let accounts = [];

for (let i = 0; i < accountNumber; i++) {
  accounts[i] = []; // Initialize the inner array (row)
  for (let j = 0; j < 5; j++) {
    accounts[i][j] = 0; // Fill each column index with a value
  }
}
accounts[0][0] = "Cyrus";
accounts[1][0] = "Ryan";
accounts[2][0] = "Matthew";
accounts[0][2] = "cyruspassword";
accounts[1][2] = "123456";
accounts[2][2] = "654321";

console.log(accounts);

const logInButton = document.querySelector("#logInButton")
const usernameInput = document.querySelector("#logInUsername")
const passwordInput = document.querySelector("#logInPassword")

logInButton.addEventListener('click', () => {
    let username = usernameInput.value;
    console.log(username)
    let password = passwordInput.value;
    console.log(password)

    for (let i = 0; i < accountNumber; i++)
        if (accounts[i][0] === username) {
            console.log("correct");
            if (accounts[i][2] === password) {
                console.log("password correct");
                localStorage.setItem('loggedIn', true);
                window.location.href = 'account-in.html'
            } else {
                continue;
            }
        } else {
            continue;
        }
    
})