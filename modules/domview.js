import { disableTabButtons } from './dom.js';

// import { MovieStorage } from './movieStorage.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let moviesFromLs = [];
let currentMovie = {};

export async function onPageLoad() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Hämta filmen från LS.
    moviesFromLs = JSON.parse(localStorage.getItem('all_movies')) || [];
    console.log(moviesFromLs);
    if (moviesFromLs && moviesFromLs.length > 0) {
        currentMovie = moviesFromLs.find((element) => String(element.id) === id);
        if (currentMovie) {
            console.log('Hittad film:', currentMovie);
            renderMovieToUI(currentMovie);
        }
    }
}
onPageLoad();

if (window.location.href.includes('movieDetail.html')) {
    disableTabButtons();
}

document.getElementById('back-button').addEventListener('click', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
});

function renderMovieToUI(currentMovie) {
    const movieImageEl = document.getElementById('movie-image');
    movieImageEl.setAttribute('src', `${IMAGE_BASE_URL}${currentMovie.poster_path}`);
    movieImageEl.setAttribute('alt', `Movie poster of ${currentMovie.title}`);
    document.getElementById('header-title').innerText = currentMovie.title;
    if (currentMovie.seen === true) {
        document.getElementById('seen').checked = currentMovie.seen;
    } else {
        document.getElementById('seen')
    };
    document.getElementById('movie-rating').innerText = `Betyg: ${currentMovie.vote_average}`;
    document.getElementById('movie-rtRating').innerText = '';
    document.getElementById('movie-description').innerText = currentMovie.overview;
};

// skapa eventlyssnare för när man togglar checkboxen för 'seen'
const seenCheckboxEl = document.getElementById('seen');

seenCheckboxEl.addEventListener('click', (e) => {
    currentMovie.seen = e.target.checked;
    // Uppdatera sedda filmer
    handleSeenToggle(currentMovie.seen, currentMovie);
});

// Uppdaterar sedda filmer
function updateSeenMovies(seen, currentMovie) {
    let seenmoviesFromLs = JSON.parse(localStorage.getItem('seen_movies') || '[]');

    if (seen) {
        // Lägg till filmen om den inte redan finns
        if (!seenmoviesFromLs.some(m => m.id === currentMovie.id)) {
            seenmoviesFromLs.push(currentMovie);

        }
    } else {
        // Ta bort den aktuella filmen om den redan finns
        seenmoviesFromLs = seenmoviesFromLs.filter(m => m.id !== currentMovie.id);
    }

    // Uppdatera localStorage
    try {
        localStorage.setItem('seen_movies', JSON.stringify(seenmoviesFromLs));
        console.log('Uppdaterad seen_movies:', seenmoviesFromLs);
    } catch (error) {
        console.error('Kunde inte läsa från localStorage:', error);
    }
}

// Uppdatera all_movies och seen_movies på ett ställe
function handleSeenToggle(seen, currentMovie) {
    // Uppdatera currentMovie och moviesFromLs
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    if (index !== -1) {
        currentMovie.seen = seen;
        moviesFromLs[index] = currentMovie;
        localStorage.setItem('all_movies', JSON.stringify(moviesFromLs));
    }
    // Uppdatera seen_movies
    updateSeenMovies(currentMovie.seen, currentMovie);
}

// ändra värde på vår rating
document.getElementById('movie-rating-select').addEventListener('change', (e) => {
    const rating = e.target.value;

    // uppdatera currentMovie med nya ratingen
    currentMovie.rating = rating;
    // har man ej klickat i att man sett filmen, men ratear, då sätter vi filmen till sedd
    if (!currentMovie.seen) {
        currentMovie.seen = 'true';
        // uppdatera elementet
        seenCheckboxEl.checked = 'true';
    }
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    // uppdatera lokala listan med nya ratingen
    moviesFromLs.splice(index, 1, currentMovie);

    // uppdatera UI med nya ratingen:
    document.getElementById('movie-rtRating').innerText = `Mitt betyg: ${rating}/5`;
    handleSeenToggle(currentMovie.seen, currentMovie);
});