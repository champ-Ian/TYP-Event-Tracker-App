// account record shape: [username, password, email, phone, pfp, school, grade, bio, role]
const usernameInput = document.querySelector('#usernameInput')
const passwordInput = document.querySelector('#passwordInput')
const emailInput = document.querySelector('#emailInput')
const phoneInput = document.querySelector('#phoneInput')
const schoolInput = document.querySelector('#schoolInput')
const gradeInput = document.querySelector('#gradeInput')
const bioInput = document.querySelector('#bioInput')
const roleInput = document.querySelector('#roleInput')

const pfpFile = document.querySelector('#pfpFile')
const pfpFileName = document.querySelector('#pfpFile-name')
const pfpPreview = document.querySelector('#pfpPreview')

// Holds the current profile picture as a base64 data URL (from the existing
// account, or replaced when the user picks a new file below).
let pfpDataUrl = null

function togglePassword(passwordId, eyeId) {
    const input = document.getElementById(passwordId)
    const eye = document.getElementById(eyeId)
    if (!input) return

    if (input.type === 'password') {
        input.type = 'text'
        if (eye) {
            eye.classList.remove('fa-eye')
            eye.classList.add('fa-eye-slash')
        }
    } else {
        input.type = 'password'
        if (eye) {
            eye.classList.remove('fa-eye-slash')
            eye.classList.add('fa-eye')
        }
    }
}

if (pfpFile) pfpFile.addEventListener('change', () => {
    const file = pfpFile.files[0]
    if (pfpFileName) pfpFileName.textContent = file?.name || 'No File Selected'
    if (!file) return

    // Profile pictures are only ever shown small, so keep them small in storage too
    compressImage(file, 400, 0.8).then((dataUrl) => {
        if (!dataUrl) return
        pfpDataUrl = dataUrl
        if (pfpPreview) pfpPreview.src = pfpDataUrl
    })
})

const saveButton = document.querySelector("#save")

if (saveButton) {
    saveButton.addEventListener('click', () => {
        if (!roleInput?.value) {
            alert('Please select your role.')
            return
        }

        const updated = [
            usernameInput?.value.trim() || '',
            passwordInput?.value || '',
            emailInput?.value.trim() || '',
            phoneInput?.value.trim() || '',
            pfpDataUrl || null,
            schoolInput?.value.trim() || '',
            gradeInput?.value.trim() || '',
            bioInput?.value.trim() || '',
            roleInput.value
        ]

        // Save to sessionStorage and localStorage. A large profile picture can
        // push either of these over the browser's storage quota and throw -
        // catch that so a storage failure can never block navigating back.
        try {
            sessionStorage.setItem('userInformation', JSON.stringify(updated))

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
            console.error('Failed to save account changes', e)
            alert('Could not save your changes - the photo may be too large. Please try a smaller image.')
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


// Read stored account info. If parsing fails or the value isn't an array,
// fall back to an empty array so the page doesn't error.
// Prefer sessionStorage (set on login); fall back to localStorage
const storedAccountInfo = sessionStorage.getItem('userInformation') || localStorage.getItem('userInformation')
let userInfo;
try {
    userInfo = storedAccountInfo ? JSON.parse(storedAccountInfo) : [];
} catch (e) {
    console.error('Failed to parse userInformation:', e)
    userInfo = []
}
if (!Array.isArray(userInfo)) userInfo = []
console.log('userInfo', userInfo)

// There's no account to edit without being logged in - without this guard,
// saving a blank form here would push a brand-new empty-username account
// into storage instead of editing anything.
if (!userInfo[0]) {
    window.location.href = 'account-out.html'
} else {
    if (usernameInput) usernameInput.value = userInfo[0] || ''
    if (passwordInput) passwordInput.value = userInfo[1] || ''
    if (emailInput) emailInput.value = userInfo[2] || ''
    if (phoneInput) phoneInput.value = userInfo[3] || ''

    pfpDataUrl = userInfo[4] || null
    if (pfpPreview && pfpDataUrl) pfpPreview.src = pfpDataUrl

    if (schoolInput) schoolInput.value = userInfo[5] || ''
    if (gradeInput) gradeInput.value = userInfo[6] || ''
    if (bioInput) bioInput.value = userInfo[7] || ''
    if (roleInput) roleInput.value = userInfo[8] || ''

    // Save original username so we can find the account record when username changes
    window.__originalUsername = userInfo[0]
}
