//when the account button in the navbar is clicked, which page to go to

const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = sessionStorage.getItem('loggedIn');
console.log('this',userLoggedIn)

if (profileButtonLink) profileButtonLink.addEventListener('click', (event) => {
    event.preventDefault();
    const nowLoggedIn = sessionStorage.getItem('loggedIn')
    if (nowLoggedIn === "true") {
        window.location.href = 'account-in.html'
    } else {
        window.location.href = 'account-out.html'
    }
})


function checkNavBar() {
    // Highlight the whole tap target (the <a>), not the bare icon: the icon
    // itself no longer has its own background/size, so styling it directly
    // only lit up a tiny box around the glyph instead of the full nav cell.
    const homeButton = document.querySelector("#houseButtonLink")
    const createButton = document.querySelector("#createEventButtonLink")
    const accountButton = document.querySelector("#profileButtonLink")
    // Compare just the filename, not the full path - this way it still works
    // whether the app is served from the root (/index.html) or a subpath
    // (e.g. /www/index.html, if Live Server is serving the repo root).
    const currentPage = window.location.pathname.split('/').pop();
    console.log(currentPage)

    // Just nudge the icon's own color for the active page - no background fill.
    function highlight(link) {
        if (!link) return
        const icon = link.querySelector('i')
        if (icon) icon.style.color = 'white'
    }

    if (currentPage === 'index.html' || currentPage === '') {
        highlight(homeButton)
    } else if (currentPage === 'create-event.html') {
        highlight(createButton)
    } else if (currentPage === 'account-in.html' || currentPage === 'account-out.html' || currentPage === 'edit-account.html') {
        highlight(accountButton)
    }
}

checkNavBar();