const BASE_URL = 'https://pokeapi.co/api/v2';
const LIMIT = 50;
const PAGE_SIZE = 10;
let currentPage = 1;

const pokemonListEl = document.getElementById('pokemon-list');
const paginationEl = document.getElementById('pagination');

async function fetchPokemonList() {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${LIMIT}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    pokemonListEl.innerHTML = '<p>An error occurred while fetching the Pokemon list. Please try again later.</p>';
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    pokemonListEl.innerHTML = '<p>An error occurred while fetching the Pokemon details. Please try again later.</p>';
  }
}

function renderPokemon(pokemon) {
  const pokemonEl = document.createElement('div');
  pokemonEl.classList.add('pokemon');
  pokemonEl.innerHTML = `
    <h3>${pokemon.name}</h3>
    <p>Abilities:</p>
    <ul>
      ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
    </ul>
    <p>Moves:</p>
    <ul>
      ${pokemon.moves.map(move => `<li>${move.move.name}</li>`).join('')}
    </ul>
    <p>Weight: ${pokemon.weight} kg</p>
  `;
  pokemonListEl.appendChild(pokemonEl);
}

function renderPagination(totalPages) {
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      renderPage();
    });
    paginationEl.appendChild(button);
  }
}

async function renderPage() {
  pokemonListEl.innerHTML = '';
  paginationEl.innerHTML = '';
  const pokemonList = await fetchPokemonList();
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pokemons = pokemonList.slice(startIndex, endIndex);
  pokemons.forEach(async pokemon => {
    const details = await fetchPokemonDetails(pokemon.url);
    renderPokemon(details);
  });
  const totalPages = Math.ceil(pokemonList.length / PAGE_SIZE);
  renderPagination(totalPages);
}

renderPage();
