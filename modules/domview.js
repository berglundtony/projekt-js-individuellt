import { disableTabButtons, getMovies } from './dom.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let moviesFromLs = [];
let currentMovie = {};


export async function onPageLoad() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Läs cachade filmer från localStorage
   const cachedMoviesRaw = localStorage.getItem('all_movies');

    if (cachedMoviesRaw) {
        try {
            const cachedMovies = JSON.parse(cachedMoviesRaw);
            console.log('cachedMovies:', cachedMovies);
            // Lägg alla filmer i en enda lista
            moviesFromLs = Object.values(cachedMovies).reduce((acc, movies) => acc.concat(movies), []);
            console.log('Alla filmer:', moviesFromLs);

            if (moviesFromLs.length === 0) {
                console.error('Inga filmer i cache.');
                return;
            }

            currentMovie = moviesFromLs.find(movie => String(movie.id) === String(id));
            console.log(`currentMovie ${currentMovie}`);

            if (!currentMovie) {
                console.error(`Ingen film hittades med id ${id}`);
                return;
            }
            console.log('Hittad film:', currentMovie);
            renderMovieToUI(currentMovie);
        } catch (error) {
            console.error('Fel vid parsing av cachedMovies:', error);
        }
    } else {
        console.warn('Ingen cache hittad.');
    }
}

onPageLoad(); 

if (window.location.href.includes('movieDetail.html')) {
    disableTabButtons();
}
// Spara aktiv flik i sessionStorage
sessionStorage.setItem('lastTab', '#popular');

document.getElementById('back-button').addEventListener('click', () => {
    const lastTab = sessionStorage.getItem('lastTab') || '#seentab';
    window.location.href = `index.html${lastTab}`;
});

function renderMovieToUI(currentMovie) {
    const movieImageEl = document.getElementById('movie-image');
    movieImageEl.setAttribute('src', `${IMAGE_BASE_URL}${currentMovie.poster_path}`);
    movieImageEl.setAttribute('alt', `Movie poster of ${currentMovie.title}`);
    document.getElementById('header-title').innerText = currentMovie.title;
    document.getElementById('movie-status').innerText = currentMovie.seen;
    document.getElementById('seen').checked = currentMovie.seen;
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
        console.log('Verifiera uppdatering av currentMovie i cache:', currentMovie);  
    } catch (error) {
        console.error('Kunde inte uppdatera localStorage:', error);
    }
}


function handleSeenToggle(seen, currentMovie) {
    // Uppdatera currentMovie och moviesFromLs
    let moviesFromLs = JSON.parse(localStorage.getItem('all_movies') || '[]');
    console.log(`currentMovie ${currentMovie}`);

    if (typeof moviesFromLs === 'object' && !Array.isArray(moviesFromLs)) {
        moviesFromLs = Object.values(moviesFromLs).flat();
    }

    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    if (index !== -1) {
        currentMovie.seen = seen;
        currentMovie.wish = 'false';
        moviesFromLs[index] = currentMovie;
        localStorage.setItem('all_movies', JSON.stringify(moviesFromLs));
    }

    // Uppdatera seen_movies och synkronisera all_movies
    updateSeenMovies(currentMovie.seen, currentMovie);
};

// ändra värde på vår rating
document.getElementById('movie-rating-select').addEventListener('change', (e) => {
    const rating = e.target.value;
    // uppdatera currentMovie med nya ratingen
    currentMovie.rating = rating;
    // Har man ej sett filmen men sätter betyg, markera som sedd
    if (!currentMovie.seen) {
        currentMovie.seen = 'true';
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