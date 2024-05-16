document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterIcon = document.getElementById('filter-icon');
    const filterModal = document.getElementById('filter-modal');
    const filterInput = document.getElementById('filter-input');
    const filterCount = document.getElementById('filter-count');
    const closeModal = document.getElementById('close-modal');

    // Função para contar e exibir o número de filtros ativos
    const updateFilterCount = () => {
        const urlParams = new URLSearchParams(window.location.search);
        let count = 0;
        urlParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'busca') {
                count++;
            }
        });
        filterCount.textContent = count;
    };

    // Abrir o modal de filtros ao clicar no ícone
    filterIcon.addEventListener('click', () => {
        filterModal.showModal();
    });

    // Fechar o modal de filtros ao clicar no botão "Fechar"
    closeModal.addEventListener('click', () => {
        filterModal.close();
    });

    // Aplicar valores dos filtros na query string
    const applyFiltersFromQuery = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('busca');
        if (searchQuery) {
            searchInput.value = searchQuery;
        }
    };

    // Atualizar contagem de filtros na inicialização
    updateFilterCount();
    // Aplicar filtros da query string nos inputs
    applyFiltersFromQuery();
});
