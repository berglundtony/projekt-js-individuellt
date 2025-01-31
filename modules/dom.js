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
        button.disabled = true;
        button.classList.add('disabled');
    });
}

export async function checkMovies() {
    // Kolla om det redan finns filmer i localstorage
    const movies = JSON.parse(localStorage.getItem('all_movies')) || [];

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
        _allMovies.forEach(movie => {
            if (movie.wish === 'true') {
                _myMovies.push(movie);
                console.log(_myMovies)
            } 
        });
        displayMovies(_myMovies, wishMoviesId)
    }
}


export function displaySeenMovies() {
    _seenMovies = JSON.parse(localStorage.getItem('seen_movies'));

    if (_seenMovies && _seenMovies.length > 0) {
        console.log('Seen movies:', _seenMovies);
        if (_seenMovies) {
            //rendera till LS.
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
    movieContainerEl.classList.add('movie_card');
    movieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${encodeURIComponent(movie.title)}" />`;

    const movieTitleEl = document.createElement('h3');
    movieTitleEl.textContent = `${movie.title}`;

    const releaseDateEl = document.createElement('p');
    releaseDateEl.textContent = `Utgivningsdatum: ${movie.release_date}`;

    const voteAvarageEl = document.createElement('p');
    voteAvarageEl.textContent = `Betyg: ${movie.vote_average}`;

    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Mitt betyg: ${movie.rating}`;

    const seenEl = document.createElement('p');
    seenEl.textContent = `Har sett: ${movie.seen}`;
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
    movieContainerEl.appendChild(movieTitleEl);
    movieContainerEl.appendChild(releaseDateEl);
    movieContainerEl.appendChild(voteAvarageEl);
    movieContainerEl.appendChild(ratingEl);
    movieContainerEl.appendChild(seenEl);
    if (moviesContainerEl.id === 'movies') {
        buttonContainerEl.appendChild(spanTextDescribingButtonEl);
        buttonContainerEl.appendChild(buttonEl);
        movieContainerEl.appendChild(buttonContainerEl);
    }
    moviesContainerEl.appendChild(movieContainerEl);
};

// Hantera mina filmer
function addToMyMovieList(id) {
    const movieList = JSON.parse(localStorage.getItem('all_movies'));
    console.log('movieList:', movieList);
    let index;
    let currentMovie = {};
    if (movieList && movieList.length > 0) {
        currentMovie = movieList.find((element) => element.id === Number(id)) || {};
        if (!movieList.some(m => m.id === currentMovie.id)) {
            index = movieList.findIndex((movie) => movie.id === Number(id));
            console.log('currentMovie:', currentMovie);
            currentMovie.wish = 'true';
            movieList.splice(index, 1, currentMovie);
        }
    }

    localStorage.setItem('all_movies', JSON.stringify(movieList));
}

const deleteButtons = document.querySelectorAll('.deleteFromMovieWishList');
deleteButtons.forEach(button =>
    button.addEventListener('click', function () {
        const id = button.getAttribute('id');
        console.log('id:', id);
        const myMovieList = JSON.parse(localStorage.getItem('myMovieList'));
        const currentDelMovie = myMovieList.find(movie => movie.id === Number(id));
        console.log(currentDelMovie);
        myMovieList.splice(myMovieList.indexOf(currentDelMovie), 1);
        localStorage.setItem('myMovieList', JSON.stringify(myMovieList));
        displayMyMovies();
    })
);
