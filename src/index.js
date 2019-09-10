document.addEventListener("DOMContentLoaded", main)

function main(){
  fetchData()

  let createBtn = document.getElementById('create-form')
  // console.log(createBtn)
  createBtn.onsubmit = e => {
    createNew(e)
  }
}

function fetchData(){
  let bar = document.getElementById("dog-bar")
  while (bar.hasChildNodes()) {
    bar.removeChild(bar.lastChild);
  }
  fetch("http://localhost:3000/pups")
  .then(response => response.json())
  // .then(pups => console.log(pups))
  .then(pups => dogBar(pups))
}

function createNew(e){
  e.preventDefault()
  const [name, image, isGoodDog] = e.target
  console.log(name.value)
  console.log(image.value)
  console.log(isGoodDog.value)
  fetch("http://localhost:3000/pups", {
    method: "POST",
    headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        image: image.value,
        // if statement changes input from string to boolean.
        isGoodDog: isGoodDog.value === "true"? true: false
      })
  }).then(resp => fetchData())
  //Below test is for confirming data types are correct is common with boolean vs string.
  // console.log(isGoodDog.value)
  // let name = e.target[0].value
  // let image = e.target[1].value
  // let isGoodDog = e.target[2].value
}

function dogBar(pups){
  let bar = document.getElementById("dog-bar")
  pups.forEach(pup => {
    let span = document.createElement("span")
    span.innerText = pup.name
    bar.appendChild(span)
    span.onclick = e => {
      showInfo(pup)
    }
    // span.addEventListener("click", e => {
    //   showInfo(pup)
    // })
    // let image =
  })
}

function showInfo(pup){
  console.log(pup)
  let div = document.getElementById("dog-info")
  while(div.firstChild){
    div.removeChild(div.firstChild)
  }
  let image = document.createElement("img")
  image.src = pup.image
  div.appendChild(image)
  let h2 = document.createElement("h2")
  h2.textContent = pup.name
  let button = document.createElement("button")
  if (pup.isGoodDog === true) {
    button.textContent = "Good Dog!"
  } else {
    button.textContent = "Bad Dog!"
  }
  button.onclick = e => {
    toggleDog(e, pup)
  }
  let deleteBtn = document.createElement("button")
  deleteBtn.textContent = "Delete"
  deleteBtn.onclick = e => {
    handleDelete(pup)
  }
  div.appendChild(h2)
  div.appendChild(button)
  div.appendChild(deleteBtn)
}

function handleDelete(pup){
  // console.log(pup)
  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: "DELETE"
  }).then(resp => {
    fetchData()
    let dogInfo = document.getElementById("dog-info")
    while (dogInfo.hasChildNodes()) {
      dogInfo.removeChild(dogInfo.lastChild);
    }
  })
}

function toggleDog(e, pup){
  // console.log(!pup.isGoodDog)
  console.log(e.target)
  if(e.target.textContent == "Bad Dog!"){
    e.target.textContent = "Good Dog!"
  } else if(e.target.textContent == "Good Dog!") {
    e.target.textContent = "Bad Dog!"
  }

  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: "PATCH",
    headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isGoodDog: !pup.isGoodDog
      })
  })
}
