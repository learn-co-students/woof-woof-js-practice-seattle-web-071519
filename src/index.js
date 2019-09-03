document.addEventListener("DOMContentLoaded", main)

function main(){
    fetchDogs()

}


function fetchDogs(){
    return fetch("http://localhost:3000/pups")
    .then (response => response.json())
    .then( function(dogsArray) {
        let div = document.getElementById("dog-bar")
        dogsArray.forEach(function(dog) {
            let dogLine = document.createElement("span")
            dogLine.setAttribute("dog-id", dog.id)
            
            dogLine.addEventListener("click", generateDogCard(dog))
            

            // dogLine.onclick = (e, dog) => {
            //     generateDogCard(e, dog)
            // }
            dogLine.innerText = dog.name
            div.appendChild(dogLine)

        })


    })

}

function generateDogCard(dog){
    return function(e){
    let div = document.getElementById("dog-info")
    while (div.firstChild){
        div.firstChild.remove()
    }
    let dogImg = document.createElement("img")
    dogImg.src = dog.image
    div.appendChild(dogImg)
    let dogName = document.createElement("h2")
    dogName.textContent = dog.name
    div.appendChild(dogName)
    let goodnessBtn = document.createElement("button")
    goodnessBtn.addEventListener("click", patchGoodness(dog))
    if (dog.isGoodDog === true){
        goodnessBtn.textContent = "Good Dog!" 
    } else {
        goodnessBtn.textContent = "Bad Dog!"
    }
    div.appendChild(goodnessBtn)

}}

function patchGoodness(dog){
    return function(e){
        console.log("first dog check",dog)
        let flipStatus = !dog.isGoodDog
        // debugger
        fetch(`http://localhost:3000/pups/${dog.id}`, {

        method: "PATCH",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            isGoodDog: `${flipStatus}`
        })
        
    })
    .then(response => response.json())
    .then(stuff => console.log(stuff))
    }
}

