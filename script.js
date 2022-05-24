window.onload = () => {
  
  const cardContainer = document.querySelector('.card-container');
  const input = document.querySelector('#search-input');
  input.addEventListener('keyup', async function() {
    const value = this.value.trim();
    const data = await getDataFromInput(value);
    putDataToCards(data);
  });
  
  function getDataFromInput(value) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
      .then(response => response.json())
      .then(response => response.meals);
  }
  
  function putDataToCards(param) {
    let string = '';
    if (param) {
      param.forEach(data => string += showCards(data));
    } else {
      const message = 'Your Search Was Not Found!';
      string += showError(message);
    }
    cardContainer.innerHTML = string;
  }
  
  // see detail recipe
  window.addEventListener('click', async function(event) {
    if (event.target.classList.contains('btn-detail')) {
      const id = event.target.dataset.id;
      const data = await getDetailData(id);
      const modalContainer = document.querySelector('.modal-container');
      modalContainer.innerHTML = showModal(data);
    }
  });
  
  function getDetailData(id) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(response => response.json())
      .then(response => response.meals[0]);
  }
  
  function showCards({idMeal, strMealThumb : image, strMeal, strInstructions}) {
    return `
    <div class="col-md-4">
      <div class="card my-1">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title fw-normal">${strMeal}</h5>
          <p class="fw-light">
            ${strInstructions.substr(0, 100)} ...
          </p>
          <a href="#" class="btn btn-outline-primary my-3 rounded-1 btn-detail" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${idMeal}">See Detail</a>
        </div>
      </div>
    </div>
    `;
  }
  
  function showError(message) {
    return `
    <div class="col-md-7 my-3 mx-auto">
      <div class="bg-danger bg-gradient p-3 rounded">
        <h2 class="fw-normal text-white">Alert!</h2>
        <span class="fw-light text-light">${message}</span>
      </div>
    </div>
    `;
  }
  
  function showModal(data) {
    return `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-normal" id="exampleModalLabel">Detail Recipe</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="d-flex justify-content-center align-items-centef my-3">
          <img src="${data.strMealThumb}" alt="image" class="img-fluid rounded">
        </div>
        <ul class="list-group">
          <li class="list-group-item p-3">
            <span class="fw-normal">Name : </span>
            <span class="fw-light">${data.strMeal}</span>
          </li>
          <li class="list-group-item p-3">
            <span class="fw-normal">Area : </span>
            <span class="fw-light">${data.strArea}</span>
          </li>
          <li class="list-group-item p-3">
            <span class="fw-normal">Category : </span>
            <span class="text-bg-primary p-2 rounded">${data.strArea}</span>
          </li>
          <li class="list-group-item p-3">
            <span class="fw-normal">Instructions : </span>
            <span class="fw-light">${data.strInstructions}}</span>
          </li>
          <li class="list-group-item p-3">
            <span class="fw-normal">Youtube : </span>
            <a href="${data.strYoutube}" class="text-decoration-none text-primary">see tutorial</a>
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close Modal</button>
      </div>
    </div>
    `;
  }
  
}