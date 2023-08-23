const searchInput = document.getElementById('search-input');
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonNameInput = document.getElementById('pokemon-name');
const pokemonListDiv = document.getElementById('pokemon-list');
const pokemonDetailsDiv = document.getElementById('pokemon-details');
const spriteContainer = document.getElementById('img-container');
const apiBaseURL = 'https://pokeapi.co/api/v2/pokemon';
const pokemonCard = document.getElementById('pokemon-card');
const image = document.getElementById('pokemon-image');

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterPokemonList(searchTerm);
});

function filterPokemonList(searchTerm) {
    const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.includes(searchTerm));
    
    pokemonListDiv.innerHTML = '';

    filteredPokemon.forEach(pokemon => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'pokemon-icon';
        iconDiv.setAttribute('data-name', pokemon.name);
        
        const img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;
        img.alt = pokemon.name;

        iconDiv.appendChild(img);
        pokemonListDiv.appendChild(iconDiv);
    });
}


function displayPokemon(data) {
    const abilities = data.abilities.map(ability => ability.ability.name);
    
    image.src = data.sprites.other["official-artwork"].front_default;
    image.alt = data.name;
    
    const pokemonDetails = `
    
    <h2>${capitalizeFirstLetter(data.name)}</h2>
    <p class="pokemon-text">ID:\xa0 ${data.id}</p>
    <p class="pokemon-text">Type:\xa0 ${data.types.map(type => type.type.name).join(',\xa0 ')}</p>
    <p class="pokemon-text">Height:\xa0 ${data.height/10}m</p>
    <p class="pokemon-text">Weight:\xa0 ${data.weight/10}kg</p>
    <p class="pokemon-text">Abilities:\xa0 ${abilities.join(',\xa0 ')}</p>      
    `;
    const textOnlyDetails = pokemonDetails.replace(/<[^>]*>/g, '');
    
    pokemonCard.innerHTML = '';
    clearInterval(typingIntervalId);
    
    spriteContainer.appendChild(image);
    typeText(textOnlyDetails, 'pokemon-card');
}

let typingIntervalId = null;

function typeText(text, targetId) {
    let index = 0;
    const targetElement = document.getElementById(targetId);

    // Check if targetElement is found
    if (!targetElement) {
        console.error(`Element with ID ${targetId} not found.`);
        return; // Exit the function if targetElement is not found
    }

    const typingInterval = 50;
    typingIntervalId = setInterval(() => {
        if (index < text.length) {
            targetElement.innerText += text[index];
            index++;
        } else {
            clearInterval(typingIntervalId);
        }
    }, typingInterval);
}

function clearPokemonContainer() {
    pokemonContainer.innerHTML = '<p>Pokémon not found.</p>';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let allPokemon = [];

async function fetchAndDisplayPokemonList() {
    try {
        const response = await fetch(`${apiBaseURL}?limit=1010`);
        const data = await response.json();
        allPokemon = data.results;
        
        pokemonListDiv.innerHTML = '';

        allPokemon.forEach(pokemon => {
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
