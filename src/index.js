let addToy = false;
const toyForm = document.querySelector(".add-toy-form")
const toyCollection = document.querySelector("#toy-collection")

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function fetchAllToys(){
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toysArr => {
    toysArr.forEach(toyObj => {
      renderEachCard(toyObj)
    })
  })
}

function renderEachCard(toyObj){
  const outerDiv = document.createElement('div')
  outerDiv.classList.add("card")
  outerDiv.dataset.id = toyObj.id
  outerDiv.innerHTML = `
    <h2>${toyObj.name}</h2>
    <img src=${toyObj.image} class="toy-avatar" />
    <p>${toyObj.likes} Likes </p>
    <button class="like-btn">Like <3</button>
  `
  toyCollection.append(outerDiv)
}

toyForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const newToyObj = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  }
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToyObj)
  })
  .then(resp => resp.json())
  .then(newToyObj => renderEachCard(newToyObj))
  toyForm.reset()
})

toyCollection.addEventListener('click', (event) => {
  if (event.target.className === "like-btn") likeToy(event.target)
})

function likeToy(toyElement){
  const cardDiv = toyElement.closest("div.card")
  const likesTag = cardDiv.querySelector("p")
  let currentLikes = parseInt(likesTag.textContent)
  
  fetch(`http://localhost:3000/toys/${cardDiv.dataset.id}`, {
    method: "PATCH",
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: currentLikes + 1
    })
  })
  .then(resp => resp.json())
  .then(data => {
    likesTag.textContent = `${data.likes} Likes`
  })
}

fetchAllToys()