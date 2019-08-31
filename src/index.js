document.addEventListener("DOMContentLoaded", main)

function main() {
    fetchPupsForDogBar()
    let goodDogFilter = document.querySelector("#good-dog-filter")
    goodDogFilter.onclick = (e) => {
        filterFlip(e)
    }
}

//show only good dogs in dog bar
function filterFlip(e) {
    let dogBar = document.querySelector("#dog-bar")
    e.target.innerText == "Filter Good Dogs: Off" ? e.target.innerText = "Filter Good Dogs: On" : e.target.innerText = "Filter Good Dogs: Off";
    fetchPupsForDogBar(e)
}

// grabs the data from the pups db
function fetchPupsForDogBar(e) {
    fetch("http://localhost:3000/pups")
        .then(response => response.json())
        .then(pups_data => {
            if (e) {
                // debugger
                if (e.target.innerText == "Filter Good Dogs: On") {
                    let good_pups = pups_data.filter(pup => pup.isGoodDog)
                    addPupsToDogBar(good_pups)
                } else {
                    addPupsToDogBar(pups_data)
                }
            } else {
                addPupsToDogBar(pups_data)
            }
        })
}

// using pups data to manipulate the DOM
addPupsToDogBar = (pups_data) => {
    let dogBar = document.querySelector("#dog-bar")
    while (dogBar.firstChild) {
        dogBar.firstChild.remove()
    }
    pups_data.forEach(pup => {
        let pupSpan = document.createElement("span")
        pupSpan.setAttribute("goodDog", `${pup.isGoodDog}`)
        pupSpan.innerText = pup.name
        pupSpan.addEventListener("click", fetchDogInfo(pup))
        dogBar.appendChild(pupSpan)
    })
}

// grabbing a single dog from the db
function fetchDogInfo(pup) {
    return function(e) {
    // console.log(pup)
    fetch(`http://localhost:3000/pups/${pup.id}`)
    .then(response => response.json())
    .then(pup_data => {
        showPupInfo(pup_data)
    })
}
}

// using the data from the db to populate info in the DOM
function showPupInfo(pup_data) {
    // debugger
    let pupInfoContainer = document.querySelector("#dog-info")
    while (pupInfoContainer.firstChild) {
        pupInfoContainer.firstChild.remove()
    }
    let pupImg = document.createElement("img")
    pupImg.src = pup_data.image
    let pupName = document.createElement("h2")
    pupName.innerText = pup_data.name
    let pupGoodnessBtn = document.createElement("button")
    if (pup_data.isGoodDog === false) {
        pupGoodnessBtn.innerText = "Bad Dog! Pet?"
    } else {
        pupGoodnessBtn.innerText = "Good Dog! Punish?"
    }
    pupGoodnessBtn.addEventListener("click", toggleGoodness(pup_data))

    pupInfoContainer.appendChild(pupImg)
    pupInfoContainer.appendChild(pupName)
    pupInfoContainer.appendChild(pupGoodnessBtn)
    }


function toggleGoodness(pup) {
    return function(e) {
        fetchUpdatePupGoodness(pup)
    }
}

fetchUpdatePupGoodness = (pup) => {
    let flipPupGoodness = !(pup.isGoodDog)
    fetch(`http://localhost:3000/pups/${pup.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isGoodDog: flipPupGoodness
        })
    }).then(response => response.json())
    .then(pup_data => { showPupInfo(pup_data)
        // debugger
        // let pupInfoContainer = document.querySelector("#dog-info")
        // if (pup_data.isGoodDog == false) {
        //     pupInfoContainer.lastChild.innerText = "Good Dog! Punish?"
        // } else {
        //     pupInfoContainer.lastChild.innerText = "Bad Dog! Pet?"
        // }
    })
}