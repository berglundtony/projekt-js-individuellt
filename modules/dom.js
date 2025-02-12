import { fetchMovies } from './fetch.js';
import { clickTabEvents } from './tabs.js';


const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
let page = 1;

let allMoviesCache = {};
let _seenMovies = [];
let _myMovies = [];

const seenMoviesId = 'seenMoviesDisplay';
const allMoviesId = 'movies';
const wishMoviesId = 'wishMoviesDisplay';

const pageCountEl = document.getElementById('page-count');


clickTabEvents();

// Gör menyflikarna inaktiva när man är i detaljvyn.
export function disableTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.disabled = 'true';
        button.classList.add('disabled');
    });
}

function init() {
    setupNextButton();
    setupPreviewButton();
    // Lägg till fler funktioner här för andra knappar eller logik
}

// Hämta de första 20 filmerna
export async function getMovies() {
    const cacheKey = `page${page}`;
    let allMoviesCache = JSON.parse(localStorage.getItem('all_movies')) || {};

    if (allMoviesCache[cacheKey]) {
        console.log(`Filmer från cache för sida ${page}`, allMoviesCache[cacheKey]);
        displayMovies(allMoviesCache[cacheKey], allMoviesId);
    } else {
        const movies = await fetchMovies(page);
        allMoviesCache[cacheKey] = movies;
        localStorage.setItem('all_movies', JSON.stringify(allMoviesCache));
        displayMovies(movies, allMoviesId);
    }

    // Hämta filmer från API:t om cache saknas
    console.log(`Hämtar filmer från API för sida ${page}`);
    const movies = await fetchMovies(page);
    // console.log(`Movies hämtade från fetch ${movies}`);
    // Cachning: Spara i localStorage
    // localStorage.setItem('wished_movies', JSON.stringify(movies));

    // Cachar filmer
    await cacheMoviesData(page, movies);

    // Visa filmer
    displayMovies(movies, allMoviesId);
}

export async function displayWishedMovies() {
    const allMoviesRaw = localStorage.getItem('wished_movies');
    _myMovies = allMoviesRaw ? JSON.parse(allMoviesRaw) : [];

    console.log('Visar filmer på önskelistan:', _myMovies);

    if (_myMovies.length > 0) {
        displayMovies(_myMovies, wishMoviesId);
    } else {
        console.log('Inga filmer på önskelistan.');
    }
}

export function displaySeenMovies() {
    _seenMovies = JSON.parse(localStorage.getItem('seen_movies'));

    if (_seenMovies && _seenMovies.length > 0) {
        console.log('Seen movies:', _seenMovies);
        if (_seenMovies) {
            displayMovies(_seenMovies, seenMoviesId);
        }
        else {
            const tabContent = document.getElementsByClassName('tab-content')[2];
            tabContent.classList.add('active');
            _seenMovies = JSON.parse(localStorage.getItem('seen_movies'));
            displayMovies(_seenMovies, seenMoviesId);
        }
    }
}

// Funktion för att visa filmer i DOM
function displayMovies(movies, moviesContainerId) {
    let moviesContainerEl = document.getElementById(moviesContainerId);
    moviesContainerEl.innerHTML = '';

    const wishedMovies = JSON.parse(localStorage.getItem('wished_movies')) || [];

    // Nollställ alla `wish` först
    movies = movies.map(movie => ({ ...movie, wish: false }));

    // Uppdatera egenskapen wish för varje film
    movies = movies.map(movie => {
        if (wishedMovies.some(wished => wished.id === movie.id)) {
            return { ...movie, wish: true };
        }
        return movie;
    });
 
    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            makeCard(movie, moviesContainerEl);
        });
    }
}

async function cacheMoviesData(page, movies) {
    let cachedMovies = JSON.parse(localStorage.getItem('all_movies')) || {};
    cachedMovies[`page${page}`] = movies;
    localStorage.setItem('all_movies', JSON.stringify(cachedMovies));
    console.log('Cache uppdaterad:', cachedMovies);
}

function setupNextButton() {
    const nextButton = document.getElementById('next-page-button');
    if (!nextButton) return;

    nextButton.addEventListener('click', async () => {
        page++;
        pageCountEl.innerHTML = `Sida ${page}`;

        // Hämta cachen från localStorage
        const cachedMovies = JSON.parse(localStorage.getItem('all_movies')) || {};
        const movies = cachedMovies[`page${page}`];
        if (movies) {
            const movies = allMoviesCache;
            displayMovies(movies, allMoviesId);
    
        } else {
            const fetchedMovies = await fetchMovies(page);
            displayMovies(fetchedMovies, allMoviesId);
            cacheMoviesData(page, fetchedMovies);
        }
    });
}

function setupPreviewButton() {
    const previewButton = document.getElementById('prev-page-button');
    if (!previewButton) return;

    previewButton.addEventListener('click', async () => {
        if (page > 1) {
            page--;
            pageCountEl.innerHTML = `Sida ${page}`;
            if (allMoviesCache[page]) {
                const movies = markWishedMovies(allMoviesCache[page]);
                displayMovies(movies, allMoviesId);
            } else {
                const movies = await fetchMovies(page);
                displayMovies(movies, allMoviesId);
            }
        }
    })
}

    async function makeCard(movie, moviesContainerEl) {
        console.log("Make Card");
        const movieContainerEl = document.createElement('article');
        //  Eventlyssnare för artikel
        movieContainerEl.addEventListener('click', () => {
            console.log('click:', movie.id);
            window.location.href = `/movieDetail.html?id=${movie.id}`;
        });

        let buttonContainerEl;
        let spanTextDescribingButtonEl;
        let buttonEl;
        let buttonContainerDelEl;
        let buttonDelEl;
        let ratingEl;
        let wishEl;

        movieContainerEl.classList.add('movie_card');
        if (movie.wish === true) {
            console.log('Adding wished class');
            movieContainerEl?.classList.add('wished');
        } else {
            console.log('Removing wished class');
            movieContainerEl.classList.remove('wished');
        }
        movieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${encodeURIComponent(movie.title)}" />`;

        const movieTitleEl = document.createElement('h3');
        movieTitleEl.textContent = `${movie.title}`;

        const releaseDateEl = document.createElement('p');
        releaseDateEl.textContent = `Utgivningsdatum: ${movie.release_date}`;

        const voteAvarageEl = document.createElement('p');
        voteAvarageEl.textContent = `Betyg: ${movie.vote_average}`;

        if (moviesContainerEl.id === 'seenMoviesDisplay') {
            ratingEl = document.createElement('p');
            ratingEl.textContent = `Mitt betyg: ${movie.rating}`;
        }

        wishEl = document.createElement('p');
        wishEl.textContent = `Mina önskade filmer: ${movie.wish}`;

        // Knappar för Populära filmer
        if (moviesContainerEl.id === 'movies') {
            buttonContainerEl = document.createElement('div');
            buttonContainerEl.classList.add('button_container');

            spanTextDescribingButtonEl = document.createElement('span');
            spanTextDescribingButtonEl.textContent = 'Önskelista:';

            buttonEl = document.createElement('button');
            buttonEl.id = movie.id;
            buttonEl.classList.add('addMovieWishList');
            buttonEl.textContent = 'Lägg till';
            buttonEl.addEventListener('click', function (event) {
                event.stopPropagation();
                const id = buttonEl.getAttribute('id');
                console.log('id:', id);
                addToMyMovieList(id);
            });
        }

        // Ta bort knappar för önskelista
        if (moviesContainerEl.id === 'wishMoviesDisplay') {
            buttonContainerDelEl = document.createElement('div');
            buttonContainerDelEl.classList.add('button_container');

            buttonDelEl = document.createElement('button');
            buttonDelEl.id = movie.id;
            buttonDelEl.classList.add('deleteMovieWishList');
            buttonDelEl.textContent = 'Ta bort';
            buttonDelEl.addEventListener('click', function (event) {
                event.stopPropagation();
                const id = buttonDelEl.getAttribute('id');
                console.log('id:', id);
                deleteFromMyMovieList(id);
            });
        }
        movieContainerEl.appendChild(movieTitleEl);
        movieContainerEl.appendChild(releaseDateEl);
        movieContainerEl.appendChild(voteAvarageEl);
        movieContainerEl.appendChild(wishEl);
        if (moviesContainerEl.id === 'seenMoviesDisplay') {
            movieContainerEl.appendChild(ratingEl);
        }

        // Append för button-container och delete knappar för Populära filmer.
        if (moviesContainerEl.id === 'movies') {
            buttonContainerEl.appendChild(spanTextDescribingButtonEl);
            buttonContainerEl.appendChild(buttonEl);
            movieContainerEl.appendChild(buttonContainerEl);
        }
        // Append för button-container och delete knappar för önskelistan.
        if (moviesContainerEl.id === 'wishMoviesDisplay') {
            buttonContainerDelEl.appendChild(buttonDelEl);
            movieContainerEl.appendChild(buttonContainerDelEl);
        }
        moviesContainerEl.appendChild(movieContainerEl);
    };

    // Lägger till filmer från Min önskelista och uppdaterar värdet i 'all_movies' i LS
    function addToMyMovieList(id) {
        // Läs cachade filmer från localStorage
        const allMoviesRaw = localStorage.getItem('all_movies');
        console.log('All movies från localStorage:', allMoviesRaw);
        let allMovies = allMoviesRaw ? JSON.parse(allMoviesRaw) : {};

        // Plocka ut alla filmer i en lista
        allMovies = Object.values(allMovies).reduce((acc, movies) => acc.concat(movies), []);
        // console.log(`Efter flat`, JSON.stringify(_allMovies, null, 2));

        // Hämta wished_movies från localStorage
        const wishedMoviesRaw = localStorage.getItem('wished_movies');
        const wishedMovies = wishedMoviesRaw ? JSON.parse(wishedMoviesRaw) : [];
        if (allMovies.length === 0) {
            console.warn('Listan med filmer är tom.');
        } else {
            console.log('Filmer i listan:', allMovies);
        }
        // Hitta och uppdatera filmen
        const index = allMovies.findIndex(movie => movie.id === Number(id));
      
        if (index !== -1) {
            const updatedMovie = { ...allMovies[index], wish: true }
            if (!wishedMovies.some(m => m.id === Number(id))) {
                wishedMovies.push(updatedMovie);
            }
            // Uppdatera wished_movies separat
            localStorage.setItem('wished_movies', JSON.stringify(wishedMovies));
            localStorage.setItem('all_movies', JSON.stringify(wishedMovies));
        }
        getMovies();
    }
    // Tar bort filmer från Min önskelista och uppdaterar värdet i 'all_movies' i LS
    function deleteFromMyMovieList(id) {
        let wiMovies = JSON.parse(localStorage.getItem('wished_movies')) || [];

        // Filtrera bort filmen med matchande id
        wiMovies = wiMovies.filter(movie => movie.id !== Number(id));
        // Uppdatera localStorage
        localStorage.setItem('wished_movies', JSON.stringify(wiMovies));

        // Uppdatera visningen
        displayWishedMovies();
    }

    document.addEventListener('DOMContentLoaded', init);

