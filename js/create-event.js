

let eventCount = 0;

function newEvent(){

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


if (!sessionStorage.getItem('hasVisited')) {
    localStorage.setItem('loggedIn', false)
  console.log("Welcome! This is your very first time here in this session.");
  
  // Set the flag so this block won't run again on reload
  sessionStorage.setItem('hasVisited', 'true');
} else {
  console.log("Page has been reloaded or navigated to previously.");
}
