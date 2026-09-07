const saveButton = document.querySelector("#save")

if (saveButton) {
    saveButton.addEventListener('click', () => {
        // gather form values and save updates
        const inputs = document.querySelectorAll('.text-input')
        const updated = Array.from(inputs).map(i => i.value)

        // save to sessionStorage for current session
        sessionStorage.setItem('userInformation', JSON.stringify(updated))

        // also update stored accounts in localStorage if present
        try {
            const s = localStorage.getItem('accounts')
            if (s) {
                const accounts = JSON.parse(s)
                // original username may be stored in the form's first input before edit
                const original = window.__originalUsername || null
                let found = false
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i] && accounts[i][0] === (original || updated[0])) {
                        accounts[i] = updated
                        found = true
                        break
                    }
                }
                if (!found) accounts.push(updated)
                localStorage.setItem('accounts', JSON.stringify(accounts))
            }
        } catch (e) {
            console.error('Failed to update accounts in localStorage', e)
        }

        window.location.href = 'account-in.html'
    })
} else {
    console.warn('Save button not found')
}


const cancelButton = document.querySelector("#cancel")

if (cancelButton) {
    cancelButton.addEventListener('click', () => {
        window.location.href = 'account-in.html'
    })
} else {
    console.warn('Cancel button not found')
}


// Read stored events from localStorage. If parsing fails or the value
// isn't an array, fall back to an empty array so the page doesn't error.
// Prefer sessionStorage (set on login); fall back to localStorage
const storedAccountInfo = sessionStorage.getItem('userInformation') || localStorage.getItem('userInformation')
let userInfo;
try {
    userInfo = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];
} catch (e) {
    console.error('Failed to parse eventStorage:', e)
    userInfo = []
}
if (!Array.isArray(userInfo)) userInfo = []
console.log('userInfo', userInfo)

const formInformacion = document.querySelectorAll('.text-input')
console.log("User info",userInfo)
for (let i = 0; i < formInformacion.length; i++) {
    formInformacion[i].value = userInfo[i] || ''
}

// Save original username so we can find the account record when username changes
if (userInfo[0]) window.__originalUsername = userInfo[0]