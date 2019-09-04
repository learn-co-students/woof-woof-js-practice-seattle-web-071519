document.addEventListener("DOMContentLoaded", main);

const pupsURL = "http://localhost:3000/pups"

function main(event){
    fetchPups();
    let filterButton = document.getElementById("good-dog-filter")
    filterButton.addEventListener("click", filterDogs)
};

function fetchPups(){
    fetch(pupsURL)
        .then(response => response.json())
        .then(pups => addDogsToBar(pups))
};



function addDogsToBar(pups){
    console.log(pups)
    let dogBar = document.getElementById("dog-bar")
    while(dogBar.firstChild){
        dogBar.removeChild(dogBar.firstChild)
    }

    pups.forEach(pup => {
        let span = document.createElement("span")
        span.textContent = pup.name
        span.setAttribute("id", pup.id)
        span.addEventListener("click", displayDoggo)
        dogBar.appendChild(span)
    })
}


function displayDoggo(event){
    fetch(`${pupsURL}/${event.target.id}`)
        .then(response => response.json())
        .then(doggo => createDogBox(doggo))
};


function createDogBox(doggo){
    let doggoDiv = document.getElementById("dog-summary-container")
    //remove old dog card if it exists
    if (document.getElementById("dog-info") != null ) {
        let oldInfo = document.getElementById("dog-info")
        doggoDiv.removeChild(oldInfo)
    };
    
    //create new dog card
    let dogInfo = document.createElement("div")
    dogInfo.id = "dog-info" 
    doggoDiv.appendChild(dogInfo)
    
    //add image to dog card
    let dogPic = document.createElement("img")
    dogPic.setAttribute("src", doggo.image)
    dogPic.setAttribute("id", "dog-info")
    dogInfo.appendChild(dogPic)
    
    //create h2 for dog name and add it to dog card
    let dogName = document.createElement("h2")
    dogName.textContent = doggo.name
    dogInfo.appendChild(dogName)

    //add button
    let goodButton = document.createElement("button")
    goodButton.setAttribute("id", doggo.id)
    if (doggo.isGoodDog == true) {
        goodButton.textContent = "Good Dog!"
    } else {
        goodButton.textContent = "Bad Dog!"
    }
    goodButton.addEventListener("click", switchDog)
    dogInfo.appendChild(goodButton)



}



function switchDog(event){
    fetch(`${pupsURL}/${event.target.id}`)
        .then(response => response.json())
        .then(function(doggo){
            doggo.isGoodDog = !doggo.isGoodDog
            patchPup(doggo)
            createDogBox(doggo)
        })
}

function patchPup(doggo){
    fetch(`${pupsURL}/${doggo.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doggo)
    })

}

function filterDogs(event){
    fetch(pupsURL)
        .then(response => response.json())
        .then(function(allPups){ 
            if (event.target.textContent == "Filter Good Dogs: ON") {
                let pups = allPups
                event.target.textContent = "Filter Good Dogs: OFF"
                addDogsToBar(pups)
            } else {
                let pups = []
                allPups.forEach(pup => {
                    if (pup.isGoodDog == true ){
                        pups.push(pup)
                    }
                })
                event.target.textContent = "Filter Good Dogs: ON"  
                addDogsToBar(pups)
            }
            })
}
