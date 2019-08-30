document.addEventListener('DOMContentLoaded',main)
const DOGURL = 'http://localhost:3000/pups'

function main(event){
    fetch(DOGURL)
    .then(res => res.json())
    .then(json => fillDoggoBar(json))

    //document.getElementById('good-dog-filter').addEventListener('click',filterGoodDogs)
}

// function filterGoodDogs(event){
//     console.log('filter dog called')
//     let filterButton = event.target
//     if (!filterButton.getAttribute('filtering')){
//         console.log('filter')
//         filterButton.setAttribute('filtering',true)

//         fetch(DOGURL)
//         .then(res => res.json())
//         .then(json => json.filter(dog => dog.isGoodDog))
//         .then(goodbois => fillDoggoBar(goodbois))


//     } else {
//         console.log('unfilter')
//         filterButton.setAttribute('filtering',false)
//         fetch(DOGURL)
//         .then(res => res.json())
//         .then(json => fillDoggoBar(json))
//     }
// }

function fillDoggoBar(json){
    let dogcontainer = document.createElement("span");

    // while (!!dogcontainer.firstChild){
    //     console.log('removed dog')
    //     dogcontainer.removeChild(dogcontainer.firstChild);
    // }
    console.log(json)
    json.forEach(dog => {
        console.log(dog)
        dogcontainer.setAttribute('dog-id',dog.id);
        dogcontainer.textContent = dog.name;
        document.getElementById("dog-bar") .appendChild(dogcontainer)
        dogcontainer.addEventListener('click',clickDog)
    });
}

function clickDog(event){
    let dogId = event.target.getAttribute("dog-id");
    console.log(dogId)
    let address = `http://localhost:3000/pups/${dogId}`
    console.log(address)
    fetch(address)
    .then(res => res.json())
    .then(json => showDog(json))
}

function showDog(json){
    
    let dogHolder = document.getElementById("dog-info");
    // while (!!dogHolder.firstChild){
    //     dogHolder.removeChild(dogHolder.firstChild);
    // }
    
    dogHolder.setAttribute('dog-id',json.id)

    let dogPic = document.createElement("img")
    dogPic.setAttribute('src',json.image)
    dogHolder.appendChild(dogPic)
    
    let dogName = document.createElement("h2")
    dogName.textContent = json.name
    dogHolder.appendChild(dogName)

    let dogButton = document.createElement("button")
    if (json.isGoodDog){
        dogButton.textContent = 'Good Dog'
    } else {
        dogButton.textContent = 'Bad Dog'
    }
    dogButton.addEventListener('click',updateGoodness)
    dogHolder.appendChild(dogButton)
}

function updateGoodness(event){
    let dogId = event.target.parentElement.getAttribute('dog-id')
    
    let goodness

    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(response => response.json()) 
    .then(
        json => {
        fetch(`http://localhost:3000/pups/${dogId}`,{
            method: 'PATCH',
            headers: {
                "Content-Type":'application/json'
            },
            body: JSON.stringify({
                'isGoodDog': !json.isGoodDog
            })
        })

        json.isGoodDog = !json.isGoodDog
        
        if (json.isGoodDog){
            event.target.textContent = 'Good Dog'
        } else {
            event.target.textContent = 'Bad Dog'
        }
    })


}