const saveButton = document.querySelector("#save")

if (saveButton) {
    saveButton.addEventListener('click', () => {
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
const storedAccountInfo = localStorage.getItem('userInformation')
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

for (let i = 0; i < formInformacion.length; i++) {
    formInformacion[i].value = userInfo[i]
}    