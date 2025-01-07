let currentPokemonId = null;
let radarChart;

document.addEventListener("DOMContentLoaded", () => {
    const pokeID = new URLSearchParams(window.location.search).get("id");
    const pokemonID = parseInt(pokeID, 10);

    if (pokemonID < 1 || pokemonID > 120) {
        window.location.href = "./index.html";
        return;
    }

    currentPokemonId = pokemonID;
    loadPokemon(pokemonID); // Ładujemy dane Pokémona
});

function createAndAppendElement(parent, tagName, attributes = {}) {
    const element = document.createElement(tagName);

    for (const [key, value] of Object.entries(attributes)) {
        element[key] = value;
    }

    parent.appendChild(element);
    return element;
}

async function navigatePokemon(newPokemonId) {
    if (newPokemonId < 1 || newPokemonId > 120) {
        return; // Zakres obsługiwanych ID: 1-120
    }

    currentPokemonId = newPokemonId;
    const success = await loadPokemon(newPokemonId);

    if (success) {
        window.history.pushState({}, "", `./detail.html?id=${newPokemonId}`);
    }
}

// Kolory tła "VAR"
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};

function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

function rgbaFromHex(hexColor) {
    return [
        parseInt(hexColor.slice(1, 3), 16),
        parseInt(hexColor.slice(3, 5), 16),
        parseInt(hexColor.slice(5, 7), 16),
    ].join(", ");
}

function setTypeBackgroundColor(pokemon) {
    const mainType = pokemon.types[0].type.name;
    console.log("Main Type:", mainType);

    const color = typeColors[mainType];
    console.log("Background Color:", color);

    if (!color) {
        console.warn(`Color not defined for type: ${mainType}`);
        return;
    }


    const detailMainElement = document.querySelector(".main-details");
    if (detailMainElement) {
        detailMainElement.style.backgroundColor = color;
        detailMainElement.style.borderColor = color;
        document.documentElement.style.setProperty('--primary-color', color); // Update CSS variable
    } else {
        console.warn('Element .main-details not found');
    }

    // Ustawienie tła dla "p" elementów
    const powerWrapperElements = document.querySelectorAll(".power-wrapper > p");

    setElementStyles(powerWrapperElements, "backgroundColor", color);
}
function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        if (element) {
            element.style[cssProperty] = value;
        } else {
            console.warn('Element not found for styling');
        }
    });
}


function displayPokemonDetails(pokemon) {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        nameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    } else {
        console.warn('Element .name not found');
    }

    const idElement = document.querySelector('.pokemon-id-wrap p');
    if (idElement) {
        idElement.textContent = `#${pokemon.id}`;
    } else {
        console.warn('Element .pokemon-id-wrap p not found');
    }

    const imgElement = document.querySelector('.detail-img-wrapper img');
    if (imgElement) {
        imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`;
        imgElement.alt = pokemon.name;
    } else {
        console.warn('Element .detail-img-wrapper img not found');
    }

    const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
    const typeElements = document.querySelectorAll('.power-wrapper .body3-fonts');
    typeElements.forEach((element, index) => {
        if (index < pokemon.types.length) {
            element.textContent = types.split(', ')[index];
        } else {
            element.textContent = '';
        }
    });

    const weightElement = document.querySelector('.pokemon-detail-wrap .pokemon-detail.weight .body3-fonts');
    if (weightElement) {
        weightElement.textContent = `${pokemon.weight / 10} kg`;
    } else {
        console.warn('Element .pokemon-detail-wrap .pokemon-detail.weight .body3-fonts not found');
    }

    const heightElement = document.querySelector('.pokemon-detail-wrap .pokemon-detail.height .body3-fonts');
    if (heightElement) {
        heightElement.textContent = `${pokemon.height / 10} m`;
    } else {
        console.warn('Element .pokemon-detail-wrap .pokemon-detail.height .body3-fonts not found');
    }

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.move");
    if (abilitiesWrapper) {
        abilitiesWrapper.innerHTML = '';
        pokemon.abilities.forEach(({ ability }) => {
            createAndAppendElement(abilitiesWrapper, "p", {
                className: "body3-fonts",
                textContent: ability.name,
            });
        });
    } else {
        console.warn('Element .pokemon-detail-wrap .pokemon-detail.move not found');
    }
}

function getEnglishFlavorText(pokemonSpecies) {
    if (!pokemonSpecies || !pokemonSpecies.flavor_text_entries) {
        return 'No description available.';
    }

    const englishTextEntry = pokemonSpecies.flavor_text_entries.find(entry => entry.language.name === 'en');

    if (englishTextEntry) {
        return englishTextEntry.flavor_text;
    }

    return 'No description available.';
}
// Canvas Wykres
function initializeRadarChart(labels) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pokemon Stats',
                data: [],
                backgroundColor: '#28abfd99',
                borderColor: 'rgba(0, 0, 20, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                pointBorderColor: '#000',
                pointHoverBackgroundColor: '#000',
                pointHoverBorderColor: 'rgba(0, 0, 0, 1)',
            }]
        },
        options: {
            scales: {
                r: {
                    ticks: {
                        display: false,
                        beginAtZero: true,
                        max: 200,
                        stepSize: 30
                    },
                    grid: {
                        color: '#000',
                    },
                    angleLines: {
                        color: '#000'
                    },
                    pointLabels: {
                        display: true,
                        color: '#000',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw;
                            return `${label}: ${value}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    formatter: (value) => value,
                    color: '#444',
                    font: {
                        size: 12
                    }
                }
            },
            backgroundColor: '#fff'
        }
    });
}

function updateRadarChart(stats) {
    const statData = {
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        "special-attack": 0,
        "special-defense": 0
    };

    stats.forEach(({ stat, base_stat }) => {
        if (statData.hasOwnProperty(stat.name)) {
            statData[stat.name] = base_stat;
        }
    });

    radarChart.data.datasets[0].data = [
        statData.hp,
        statData.attack,
        statData.defense,
        statData.speed,
        statData["special-defense"],
        statData["special-attack"]
    ];

    radarChart.update();
}

function redirectToPokemonDetailPage(pokemonID) {
    window.location.href = `./detail.html?id=${pokemonID}`;
}

async function loadPokemon(pokemonID) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`).then(response => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonID}`).then(response => response.json())
        ]);

        displayPokemonDetails(pokemon);
        setTypeBackgroundColor(pokemon);

        const stats = pokemon.stats;
        const labels = [

            // Dynamiczne etykiety
            `HP: ${stats.find(stat => stat.stat.name === 'hp').base_stat}`,
            `Attack: ${stats.find(stat => stat.stat.name === 'attack').base_stat}`,
            `Defense: ${stats.find(stat => stat.stat.name === 'defense').base_stat}`,
            `Speed: ${stats.find(stat => stat.stat.name === 'speed').base_stat}`,
            `Sp. Def: ${stats.find(stat => stat.stat.name === 'special-defense').base_stat}`,
            `Sp. Atk: ${stats.find(stat => stat.stat.name === 'special-attack').base_stat}`
        ];

        // Inicjalizacja wykresu z dynamicznymi etykietami
        if (!radarChart) {
            initializeRadarChart(labels);
        } else {
            radarChart.data.labels = labels;
            radarChart.update();
        }

        // Aktu wykresu z danymi Pokémona
        updateRadarChart(stats);

        // Aktu tekstu z opisem Pokémona
        const flavorText = getEnglishFlavorText(pokemonSpecies);
        document.querySelector(".body3-fonts.pokemon-description").textContent = flavorText;

        document.querySelector("#leftArrow").onclick = () => navigatePokemon(pokemonID - 1);
        document.querySelector("#rightArrow").onclick = () => navigatePokemon(pokemonID + 1);

        return true;
    } catch (error) {
        console.error("An error occurred while fetching Pokemon data:", error);
        return false;
    }
}
