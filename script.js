document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://servicodados.ibge.gov.br/api/v3/noticias';
    const newsList = document.getElementById('news-list');
    const pagination = document.getElementById('pagination');
    const filterIcon = document.getElementById('filter-icon');
    const filterDialog = document.getElementById('filter-dialog');
    const filterForm = document.getElementById('filter-form');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const filterCount = document.getElementById('filter-count');
  
    let filters = new URLSearchParams(window.location.search);
    let page = parseInt(filters.get('page')) || 1;
    let perPage = parseInt(filters.get('quantidade')) || 10;
  
    // Load initial data
    loadNews();
  
    // Event listeners
    filterIcon.addEventListener('click', () => {
      filterDialog.showModal();
    });
  
    document.getElementById('close-dialog').addEventListener('click', () => {
      filterDialog.close();
    });
  
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
      filterDialog.close();
    });
  
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applySearch();
    });
  
    pagination.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        page = parseInt(e.target.textContent);
        updateQueryString();
        loadNews();
      }
    });
  
    // Fetch and display news
    async function loadNews() {
      let query = new URLSearchParams(window.location.search);
      let response = await fetch(`${apiUrl}?${query.toString()}`);
      let data = await response.json();
  
      renderNews(data.items);
      renderPagination(data.totalPages);
    }
  
    // Render news list
    function renderNews(newsItems) {
      newsList.innerHTML = '';
      newsItems.forEach(news => {
        let li = document.createElement('li');
        li.innerHTML = `
          <img src="https://agenciadenoticias.ibge.gov.br/${news.imagens.thumbnail.url}" alt="${news.titulo}">
          <h2>${news.titulo}</h2>
          <p>${news.introducao}</p>
          <p class="editorias">#${news.editorias.join(' #')}</p>
          <p class="data">${formatDate(news.data_publicacao)}</p>
          <button class="read-more" onclick="window.open('https://agenciadenoticias.ibge.gov.br/${news.link}', '_blank')">Leia Mais</button>
        `;
        newsList.appendChild(li);
      });
    }
  
    // Render pagination
    function renderPagination(totalPages) {
      pagination.innerHTML = '';
      let start = Math.max(page - 5, 1);
      let end = Math.min(page + 4, totalPages);
      for (let i = start; i <= end; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        if (i === page) button.classList.add('active');
        pagination.appendChild(button);
      }
    }
  
    // Apply filters and update query string
    function applyFilters() {
      let formData = new FormData(filterForm);
      filters = new URLSearchParams();
      formData.forEach((value, key) => {
        if (value) filters.append(key, value);
      });
      filters.set('page', 1);
      updateQueryString();
      loadNews();
    }
  
    // Apply search term and update query string
    function applySearch() {
      let searchTerm = searchInput.value;
      if (searchTerm) {
        filters.set('busca', searchTerm);
      } else {
        filters.delete('busca');
      }
      filters.set('page', 1);
      updateQueryString();
      loadNews();
    }
  
    // Update URL query string without reloading
    function updateQueryString() {
      window.history.pushState({}, '', '?' + filters.toString());
    }
  
    // Format date
    function formatDate(dateString) {
      let date = new Date(dateString);
      let now = new Date();
      let diffTime = Math.abs(now - date);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) return 'Publicado ontem';
      if (diffDays === 0) return 'Publicado hoje';
      return `Publicado há ${diffDays} dias`;
    }
  });
  