let allPokemonData = [];
let filteredPokemonData = [];
const itemsPerPage = 30;
let currentPage = 1;
let filterBy = 'name';

// Pobieranie Pokémonów
fetch('https://pokeapi.co/api/v2/pokemon?limit=120')
    .then(response => response.json())
    .then(async data => {
        allPokemonData = await Promise.all(data.results.map(async (pokemon) => {
            return fetchPokemonData(pokemon.name);
        }));
        filteredPokemonData = allPokemonData;
        renderPage(currentPage);
    });

// Pobieranie danych Pokémona
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch Pokemon data", error);
        return null;
    }
}

// Wyświetlanie Pokémonów
function displayPokemon(pokemons) {
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';

    pokemons.forEach((pokemonData) => {
        if (!pokemonData) return;

        const pokemonID = pokemonData.id;
        const divElement = document.createElement('div');
        divElement.classList.add('pokemon-box');
        divElement.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemonID}</p>
            </div>
            <div class="img-wrap">
                <img class="poke" src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemonData.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemonData.name}</p>
            </div>
        `;
        divElement.addEventListener("click", () => {
            window.location.href = `./detail.html?id=${pokemonID}`;
        });

        pokemonContainer.appendChild(divElement);
    });
}

// Renderowanie strony z Pokémonami
function renderPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedPokemons = filteredPokemonData.slice(start, end);

    displayPokemon(paginatedPokemons);

    document.getElementById('page-number').textContent = page;
    document.getElementById('prev').disabled = page === 1;
    document.getElementById('next').disabled = page === Math.ceil(filteredPokemonData.length / itemsPerPage);
}

// Zmiana strony
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= Math.ceil(filteredPokemonData.length / itemsPerPage)) {
        currentPage = newPage;
        renderPage(currentPage);
    }
}

document.getElementById('prev').addEventListener('click', () => changePage(-1));
document.getElementById('next').addEventListener('click', () => changePage(1));

// Filtrowanie Pokémonów
document.getElementById('search_input').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();

    filteredPokemonData = allPokemonData.filter(pokemon => {
        if (filterBy === 'name') {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        } else if (filterBy === 'number') {
            return pokemon.id.toString() === searchTerm;
        }
        return false;
    });

    currentPage = 1;
    if (filteredPokemonData.length === 0) {
        document.getElementById('not-found-message').style.display = 'block';
        document.querySelectorAll('.pokemon-box').forEach(box => box.style.display = 'none');
    } else {
        document.getElementById('not-found-message').style.display = 'none';
        renderPage(currentPage);
    }
});

// Przełączanie widoczności filter-wrapper
document.querySelector('.sort-icon').addEventListener('click', function () {
    const filterWrapper = document.querySelector('.filter-wrapper');
    filterWrapper.classList.toggle('show');
});

// Zmiana filtrowania
document.querySelectorAll('input[name="filters"]').forEach((radio) => {
    radio.addEventListener('change', function () {
        filterBy = this.value;
        document.getElementById('search_input').value = '';
        filteredPokemonData = allPokemonData;
        currentPage = 1;
        renderPage(currentPage);
    });
});

// Ikona zamykania i wyszukiwania
const inputElement = document.getElementById('search_input');
const searchCloseIcon = document.querySelector('.search-close-icon');

inputElement.addEventListener('input', () => {
    searchCloseIcon.classList.toggle('search-close-icon-visible', inputElement.value !== '');
});

searchCloseIcon.addEventListener('click', () => {
    inputElement.value = '';
    searchCloseIcon.classList.remove('search-close-icon-visible');
    document.getElementById('not-found-message').style.display = 'none';
    filteredPokemonData = allPokemonData;  // Przywracamy pełną listę
    renderPage(currentPage);  // Odswieżamy widok
});


