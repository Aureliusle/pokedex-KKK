const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonNameInput = document.getElementById('pokemon-name');
const pokemonListDiv = document.getElementById('pokemon-list');
const pokemonDetailsDiv = document.getElementById('pokemon-details');
const apiBaseURL = 'https://pokeapi.co/api/v2/pokemon';

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.toLowerCase();
    try {
        const response = await fetch(`${apiBaseURL}/${searchTerm}`);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const pokemonData = await response.json();
        displayPokemon(pokemonData);
    } catch (error) {
        console.error(error);
        clearPokemonContainer();
    }
});
function displayPokemon(data) {
  const abilities = data.abilities.map(ability => ability.ability.name);
const pokemonDetails = `
        <div class="pokemon-card">
            <img src= ${data.sprites.other[official-artwork].front_default} alt="${data.name}">
            <h2>${capitalizeFirstLetter(data.name)}</h2>
            <p>ID: ${data.id}</p>
            <p>Type: ${data.types.map(type => type.type.name).join(', ')}</p>
            <p>Height: ${data.height}</p>
            <p>Weight: ${data.weight}</p>
            <p>Abilities: ${abilities.join(', ')}</p> 
        </div>
             
    `;
    pokemonContainer.innerHTML = pokemonDetails;
}

function clearPokemonContainer() {
    pokemonContainer.innerHTML = '<p>Pokémon not found.</p>';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
   
async function fetchAndDisplayPokemonList() {
    try {
        const response = await fetch(`${apiBaseURL}?limit=1010`);
        const data = await response.json();
        const pokemonList = data.results;
        
        pokemonListDiv.innerHTML = '';

        pokemonList.forEach(pokemon => {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'pokemon-icon';
            iconDiv.setAttribute('data-name', pokemon.name);
            
            const img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;
            img.alt = pokemon.name;

            iconDiv.appendChild(img);
            pokemonListDiv.appendChild(iconDiv);
        });
    } catch (error) {
        console.error(error);
    }
}


fetchAndDisplayPokemonList();

pokemonListDiv.addEventListener('click', async (event) => {
    const clickedPokemonName = event.target.getAttribute('alt');
    try {
        const response = await fetch(`${apiBaseURL}/${clickedPokemonName}`);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const pokemonData = await response.json();
        displayPokemon(pokemonData);
    } catch (error) {
        console.error(error);
        clearPokemonContainer();
    }
}); 