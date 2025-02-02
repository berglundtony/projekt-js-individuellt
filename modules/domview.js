import { disableTabButtons } from './dom.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let moviesFromLs = [];
let currentMovie = {};

export async function onPageLoad() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Hämta filmen från LS.
    moviesFromLs = JSON.parse(localStorage.getItem('all_movies')) || [];
    if (moviesFromLs && moviesFromLs.length > 0) {
        currentMovie = moviesFromLs.find((element) => String(element.id) === id);
        if (!currentMovie) {
            console.error(`Ingen film hittades med id ${id}`);
            return;
        }
        renderMovieToUI(currentMovie);
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
    document.getElementById('movie-description').innerText = currentMovie.overview
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

    if (!currentMovie || !currentMovie.id) {
        console.error('Ogiltig film, kan inte uppdatera seen_movies:', currentMovie);
        return;
    }
    let seenmoviesFromLs = JSON.parse(localStorage.getItem('seen_movies') || '[]');

    if (seen) {
        const index = seenmoviesFromLs.findIndex(m => m.id === currentMovie.id)
        // Lägg till filmen om den inte redan finns
        if (!seenmoviesFromLs.some(m => m.id === currentMovie.id)) {
            seenmoviesFromLs.push(currentMovie);
        } else {
            seenmoviesFromLs[index] = currentMovie;
        }
    } else {
        // Ta bort den aktuella filmen om den redan finns
        seenmoviesFromLs = seenmoviesFromLs.filter(m => m.id !== currentMovie.id);
    }

    // Uppdatera localStorage
    try {
        localStorage.setItem('seen_movies', JSON.stringify(seenmoviesFromLs));
    
    } catch (error) {
        console.error('Kunde inte uppdatera localStorage:', error);
    }
}

function handleSeenToggle(seen, currentMovie) {
    // Uppdatera currentMovie och moviesFromLs
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    if (index !== -1) {
        currentMovie.seen = seen;
        currentMovie.wish = 'false';
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
    // Har man ej sett filmen men sätter betyg, markera som sedd
    if (!currentMovie.seen) {
        currentMovie.seen = 'true';
        currentMovie.wish = 'false';
        seenCheckboxEl.checked = 'true';
    }
    // updateSeenMovies(currentMovie.seen, currentMovie);
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    // uppdatera lokala listan med nya ratingen
    moviesFromLs.splice(index, 1, currentMovie);
    // uppdatera UI med nya ratingen:
    document.getElementById('movie-rtRating').innerText = `Mitt betyg: ${rating}/10`;
    handleSeenToggle(currentMovie.seen, currentMovie);
});