import { fetchMovies } from './fetch.js';
import { clickTabEvents } from './tabs.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let _allMovies = [];
let _seenMovies = [];
let _myMovies = [];

const seenMoviesId = 'seenMoviesDisplay';
const allMoviesId = 'movies';
const wishMoviesId = 'wishMoviesDisplay';

clickTabEvents();

export function disableTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.disabled = 'true';
        button.classList.add('disabled');
    });
}

export async function checkMovies() {
    // Kolla om det redan finns filmer i localstorage
    let movies = JSON.parse(localStorage.getItem('all_movies')) || [];
    movies = movies.filter(movie => !movie.seen);
    console.log('movies:', movies);
    if (movies && movies.length > 0) {
        displayMovies(movies, allMoviesId);
    }
    else {
        fetchMovies();
        _allMovies = await JSON.parse(localStorage.getItem('all_movies'));
        displayMovies(_allMovies, allMoviesId);
    }
}
export async function displayWishedMovies() {
    _allMovies = JSON.parse(localStorage.getItem('all_movies')) || [];
    if (_allMovies && _allMovies.length > 0) {
        _myMovies = _allMovies.filter(movie => movie.wish === 'true');
    };
    displayMovies(_myMovies, wishMoviesId);
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
    console.log(moviesContainerId);
    // if(moviesContainerId === 'movies')
    // movies = movies.filter(m => !m.seen)
    console.log(`filmer filtrerade ${movies}`)

    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            makeCard(movie, moviesContainerEl);
        });
    }
}

async function makeCard(movie, moviesContainerEl) {
    console.log(moviesContainerEl);
    const movieContainerEl = document.createElement('article');
    // På min artikel vill jag ha en eventlyssnare
    movieContainerEl.addEventListener('click', function () {
        console.log('click:', movie.id);
        window.location.href = `/movieDetail.html?id=${movie.id}`;
    });
    let buttonContainerEl;
    let spanTextDescribingButtonEl;
    let buttonEl;
    let buttonContainerDelEl;
    let buttonDelEl;
    let seenEl;
    let ratingEl

    movieContainerEl.classList.add('movie_card');
    if (movie.wish === 'true') {
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
    const movieList = JSON.parse(localStorage.getItem('all_movies'));
    console.log('movieList:', movieList);
    let index;
    let currentMovie = {};
    if (movieList && movieList.length > 0) {
        currentMovie = movieList.find((element) => element.id === Number(id)) || {};
        console.log(currentMovie)
        if (movieList.some((m) => m.id === currentMovie.id)) {
            index = movieList.findIndex((movie) => movie.id === Number(id));
            console.log('currentMovie index:', index);
            currentMovie.wish = 'true';
            movieList.splice(index, 1, currentMovie);
        }
    }
    localStorage.setItem('all_movies', JSON.stringify(movieList));
}

// Tar bort filmer från Min önskelista och uppdaterar värdet i 'all_movies' i LS
function deleteFromMyMovieList(id) {
    _allMovies = JSON.parse(localStorage.getItem('all_movies'));
    const currentDelMovie = _allMovies.find(movie => movie.id === Number(id));
    currentDelMovie.wish = 'false';
    console.log(currentDelMovie);
    const index = _allMovies.findIndex((m) => m.id === currentDelMovie.id);
    _allMovies.splice(index, 1, currentDelMovie);
    localStorage.setItem('all_movies', JSON.stringify(_allMovies));
    displayWishedMovies();
}

