const API_KEY = '0bd07cd4d4166d94ef83bad8d6d24b08'; // Ersätt med din API-nyckel
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const _movies = JSON.parse(localStorage.getItem('movieList')) || [];

async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=sv-SE&page=1`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}


// Funktion för att visa filmer i DOM
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Rensa tidigare innehåll

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie_container');
        movieElement.innerHTML = `
    <article class="movie_card">
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>Utgivningsdatum: ${movie.release_date}</p>
        <p>Betyg: ${movie.vote_average}</p>
        <div class="button_container">
            <button id="${movie.id}" data-movie-title="${movie.title}" data-poster-path"${movie.poster_path}" class="btn addMovieList">Lägg till</button>
        </div>
    </article>
    `;
        moviesContainer.appendChild(movieElement);
    });
}
const addButtons = document.querySelectorAll('.addMovieList');
addButtons.forEach(button =>
    button.addEventListener('click', function () {
        const id = getAttribute('#id');
        const title = getAttribute('data-movie-title');
        const poster = getAttribute('data-poster-path');
        console.log('id:', id, 'title:', title, 'poster:', poster);
        addToMovieList(id, title, poster);
    })
);


    
function addToMovieList(id, title, poster) {
        const movie = { id, title, poster };
        _movies.push(movie);
        localStorage.setItem('movieList', JSON.stringify(_movies));
}

fetchMovies();