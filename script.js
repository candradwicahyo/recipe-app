window.onload = () => {
  
  const array = [
    'chicken',
    'chocolate',
    'meat',
    'cookies',
    'rice',
    'fish'
  ];
  
  const content = document.querySelector('.content');
  
  async function loadData(filename = 'search', param = 's', value = 'chicken') {
    try {
      // jalankan fungsi fetchData untuk mengambil data 
      const result = await fetchData(filename, param, value);
      // tampilkan element
      updateUI(result.meals);
    } catch (error) {
      // jika megalami masalah saat mengambil data
      content.innerHTML = showError(error);
    }
  }
  
  // dapatkan value acak dari sebuah 'array' di variabel array
  const result = array[Math.floor(Math.random() * array.length)];
  
  // jalankan fungsi loadData();
  loadData('search', 's', result);
  
  function fetchData(filename, param, value) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/${filename}.php?${param}=${value}`)
      .then(response => response.json())
      .then(response => {
        // jika data yang dicari tidak ditemukan
        if (response.meals == null) throw new Error('data not found!');
        // jika data ditemukan
        return response;
      })
      .catch(error => {
        // jika mengalami error saat mengambil data
        throw new Error(error);
      });
  }
  
  function showError(message) {
    return `
    <div class="col-md-6 mx-auto">
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error!</h4>
        <p class="my-auto">${message}</p>
      </div>
    </div>
    `;
  }
  
  function updateUI(param) {
    // string kosong
    let result = '';
    /*
      looping data dan masukkan hasil dari fungsi showCards()
      kedalam variabel result
    */
    param.forEach(data => result += showCards(data));
    // kosongkan element content
    content.innerHTML = '';
    // tampilkan isi variabel result ke element content
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function showCards(param) {
    return `
    <div class="col-md-4">
      <div class="card my-2">
        <img src="${param.strMealThumb}" class="card-img-top">
        <div class="card-body">
          <h3 class="fw-normal">${param.strMeal}</h3>
          <p class="fw-light mb-3">${filter(param.strInstructions)}</p>
          <button class="btn btn-outline-primary rounded-1 btn-detail" data-id="${param.idMeal}" data-bs-toggle="modal" data-bs-target="#modalBox">see detail</button>
        </div>
      </div>
    </div>
    `;
  }
  
  function filter(string) {
    // batas panjang karakter
    const limit = 150;
    /*
      batasi panjang karakter teks dan berikan sebuah
      string berisi titik 3 supaya teks terlihat seperti teks yang panjang
    */
    return string.substring(0, limit) + ' ...';
  }
  
  // input pencarian data
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('keyup', function() {
    // value input
    const value = this.value.trim();
    // jalankan fungsi loadData()
    loadData('search', 's', (!value) ? result : value);
  });
  
  const modalContainer = document.querySelector('.modal-container');
  window.addEventListener('click', async event => {
    // jika element yang ditekan memiliki class "btn-detail"
    if (event.target.classList.contains('btn-detail')) {
      try {
        // ambil id pada atribut "data-id"
        const id = event.target.dataset.id;
        // jalankan fungsi fetchData()
        const data = await fetchData('lookup', 'i', id);
        // jalankan fungsi updateDetailUI()
        updateDetailUI(data.meals[0]);
      } catch (error) {
        // jika mengalami masalah saat mengambil data detail
        modalContainer.innerHTML = showError(error);
      }
    }
  });
  
  function updateDetailUI(param) {
    // kosongkan element modal content
    modalContainer.innerHTML = '';
    // jalankan fungsi showDetail() dan masukkan hasilnya kedalam variabel result
    const result = showDetail(param);
    // tampilkan isi variabel result
    modalContainer.insertAdjacentHTML('beforeend', result);
  }
  
  function showDetail(param) {
    return `
    <!-- gambar -->
    <img src="${param.strMealThumb}" class="img-fluid mb-3">
    <!-- akhir gambar -->
    <!-- list -->
    <ul class="list-group">
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-2">name :</span>
          <span class="fw-light">${param.strMeal}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-2">category :</span>
          <span class="fw-light">${param.strCategory}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-2">area :</span>
          <span class="fw-light">${param.strArea}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex flex-column">
          <span class="fw-normal mb-2">instructions :</span>
          <span class="fw-light">${param.strInstructions}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex flex-column">
          <span class="fw-normal mb-2">ingredients :</span>
          <span class="fw-light">${getIngredient(param)}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-2">youtube channel :</span>
          <a href="${param.strYoutube}" target="_blank" class="text-decoration-none fw-normal text-primary">click here</span>
        </div>
      </li>
    </ul>
    <!-- akhir list -->
    `;
  }
  
  function getIngredient(param) {
    const result = [];
    for (const data in param) {
      if (data.includes('strIngredient')) {
        result.push(param[data]);
      }
    }
    return result.join(' ');
  }
  
}