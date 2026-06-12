//when the account button in the navbar is clicked, which page to go to

const profileButtonLink = document.querySelector("#profileButtonLink")
const userLoggedIn = localStorage.getItem('loggedIn');
console.log(userLoggedIn)

profileButtonLink.addEventListener('click', () => {
    if (userLoggedIn == true) {
        window.location.href = 'account-in.html'
        console.log("yay")
    } else {
        window.location.href = 'account-out.html'
    }
})

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
