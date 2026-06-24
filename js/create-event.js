

let eventCount = 0;

function createEvent(){

    const title =
        document.getElementById("title").value;

    const date =
        document.getElementById("date").value;

    const description =
        document.getElementById("description").value;

    const image =
        document.getElementById("image").files[0];

    if(!title || !date){
        alert("Please fill out all required fields.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){

        const eventCard =
        document.createElement("div");

        eventCard.className = "event";

        eventCard.innerHTML = `
            ${
                image
                ? `<img src="${e.target.result}">`
                : ""
            }

            <div class="event-content">
                <h3>${title}</h3>
                <div class="event-date">${date}</div>
                <p>${description}</p>
            </div>
        `;

        document
            .getElementById("eventList")
            .prepend(eventCard);

        eventCount++;

        document.getElementById(
            "eventCount"
        ).textContent = eventCount;

        document.getElementById("title").value="";
        document.getElementById("date").value="";
        document.getElementById("description").value="";
        document.getElementById("image").value="";
    };

    if(image){
        reader.readAsDataURL(image);
    }else{
        reader.onload({
            target:{result:""}
        });
    }
}
const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = localStorage.getItem('loggedIn');
console.log(userLoggedIn)

profileButtonLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (userLoggedIn === "true") {
        window.location.href = 'account-in.html'
    } else {
        window.location.href = 'account-out.html'
    }
})

if (!sessionStorage.getItem('hasVisited')) {
    localStorage.setItem('loggedIn', false)
  console.log("Welcome! This is your very first time here in this session.");
  
  // Set the flag so this block won't run again on reload
  sessionStorage.setItem('hasVisited', 'true');
} else {
  console.log("Page has been reloaded or navigated to previously.");
}

function checkNavBar() {
    const homeButton = document.querySelector("#homeButtonLink")
    const createButton = document.querySelector("#createEventButtonLink")
    const accountButton = document.querySelector("#profileButtonLink")
    const currentPage = window.location.href;
    if (currentPage === 'index.html') {
        homeButton.className = "fa-regular fa-house fa-xl"
        createButton.className = "fa-solid fa-circle-plus fa-xl"
        accountButton.className = "fa-solid fa-user fa-xl"
    } else if (currentPage === 'create-event.html') {
        homeButton.className = "fa-solid fa-house fa-xl"
        createButton.className = "fa-regular fa-circle-plus fa-xl"
        accountButton.className = "fa-solid fa-user fa-xl"
    } else if (currentPage === 'account-in.html') {
        homeButton.className = "fa-solid fa-house fa-xl"
        createButton.className = "fa-solid fa-circle-plus fa-xl"
        accountButton.className = "fa-regular fa-user fa-xl"
    }
}
