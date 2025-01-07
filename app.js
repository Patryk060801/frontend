let model;

async function loadModel() {
    // Załaduj model TensorFlow.js
    model = await tf.loadLayersModel('path_to_your_pokemon_model/model.json');
}

async function recognizePokemon(imageElement) {
    const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])  // Zmiana rozmiaru obrazu do rozmiaru wejściowego modelu
        .toFloat()
        .expandDims();

    const prediction = await model.predict(tensor).data();

    // Przypuśćmy, że model zwraca tablicę z prawdopodobieństwami dla każdego Pokemona
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const pokemonName = getPokemonName(maxIndex);  // Funkcja do mapowania indeksu na nazwę Pokemona

    return pokemonName;
}

function getPokemonName(index) {
    // Funkcja, która zwraca nazwę Pokemona na podstawie indeksu
    const pokemonNames = ['Bulbasaur', 'Charmander', 'Squirtle', /* ... */];  // Dodaj więcej nazw Pokemonów
    return pokemonNames[index];
}