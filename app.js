const API_KEY = '0bd07cd4d4166d94ef83bad8d6d24b08'; // Ersätt med din API-nyckel
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
// Hämta filmer från localstorage

const _allMovies = JSON.parse(localStorage.getItem('all_movies')) || [];
const _myMovies = JSON.parse(localStorage.getItem('myMovieList')) || [];
// Data från API:et
async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=sv-SE&page=1`);
        if (!response.ok) {
            throw new Error('Error status:', response.status);
        }
        const data = await response.json();
        // ändra i varje filmobjekt, så den får review och rating
        // loopa över listan
        data.results.forEach(movie => {
            movie.seen = false;
            movie.rating = 0;
            movie.review = '';
        });
        // spara svaret från API till LS
        localStorage.setItem('all_movies', JSON.stringify(data.results));
        // displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}


// Funktion för att visa filmer i DOM
function displayMovies(movies) {
    const moviesContainerEl = document.getElementById('movies');
    moviesContainerEl.innerHTML = ''; // Rensa tidigare innehåll

    movies.forEach(movie => {
        const movieContainerEl = document.createElement('article');
        movieContainerEl.classList.add('movie_card');
        movieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" />`;
        const movieTitleEl = document.createElement('h3');
        const btnEditEl = document.createElement('button');
        btnEditEl.id = movie.id;
        btnEditEl.textContent = 'Redigera';
        btnEditEl.classList.add('editMovie');
        movieContainerEl.appendChild(btnEditEl);
        movieTitleEl.textContent = `${movie.title}`;
        movieContainerEl.appendChild(movieTitleEl);
        const releaseDateEl = document.createElement('p');
        releaseDateEl.textContent = `Utgivningsdatum: ${movie.release_date}`;
        movieContainerEl.appendChild(releaseDateEl);
        const voteAvarageEl = document.createElement('p');
        voteAvarageEl.textContent = `Betyg: ${movie.vote_average}`;
        movieContainerEl.appendChild(voteAvarageEl);
        const ratingEl = document.createElement('p');
        ratingEl.textContent = `Mitt betyg: ${movie.rating}`;
        movieContainerEl.appendChild(ratingEl);
        const reviewEl = document.createElement('p');
        reviewEl.textContent = `Min recention: ${movie.review}`;
        movieContainerEl.appendChild(reviewEl);
        const seenEl = document.createElement('p');
        seenEl.textContent = `Har sett: ${movie.seen}`;
        movieContainerEl.appendChild(seenEl);
        const buttonContainerEl = document.createElement('div');
        buttonContainerEl.classList.add('button_container');
        const spanTextDescribingButtonEl = document.createElement('span');
        spanTextDescribingButtonEl.textContent = 'Lägg till i din önskelista:';
        buttonContainerEl.appendChild(spanTextDescribingButtonEl);
        const buttonEl = document.createElement('button');
        buttonEl.id = movie.id;
        buttonEl.classList.add('addMovieWishList');
        buttonEl.textContent = 'Lägg till';
        buttonContainerEl.appendChild(buttonEl);
        movieContainerEl.appendChild(buttonContainerEl);
        moviesContainerEl.appendChild(movieContainerEl);
    });
}

function checkMovies() {
    // Kolla om det redan finns filmer i localstorage
    const movies = JSON.parse(localStorage.getItem('all_movies'));
    console.log('movies:', movies);
    if (movies.length > 0) {
        // I så fall: rendera till LS.
        displayMovies(movies);
    }
    else {
        fetchMovies();
        const updated_all_movies = JSON.parse(localStorage.getItem("all_movies"));
        displayMovies(updated_all_movies);
    }
}
checkMovies();
displayMyMovies();

const addButtons = document.querySelectorAll('.addMovieWishList');
addButtons.forEach(button =>
    button.addEventListener('click', function () {
        const id = button.getAttribute('id');
        console.log('id:', id);
        addToMyMovieList(id);
    })
);

function addToMyMovieList(id) {
    let myMovie = [];
    const movieList = JSON.parse(localStorage.getItem('all_movies'));
    console.log('movieList:', movieList);
    const currentMovie = movieList.find(movie => movie.id === Number(id));
    // currentMovie.seen = true;
    console.log('currentMovie:', currentMovie);
    myMovie = {
        id: currentMovie.id,
        title: currentMovie.title,
        poster: currentMovie.poster_path,
        vote_average: currentMovie.vote_average,
        release_date: currentMovie.release_date,
        seen: currentMovie.seen,
    }
    _myMovies.push(myMovie);
    // Uppdatera localstorage med ny egenskap på seen, alltså säg att den är sedd
    // Fast fel tänkt föresten den är bara vald inte sedd.
    // movieList.splice(movieList.indexOf(currentMovie), 1, currentMovie);
    localStorage.setItem('myMovieList', JSON.stringify(_myMovies));
    displayMyMovies();
}

function displayMyMovies() {
    const wishListMovies = JSON.parse(localStorage.getItem("myMovieList"));
    console.log('wishListMovies:', wishListMovies);

    const myMoviesContainerEl = document.getElementById('myMovies');
    myMoviesContainerEl.innerHTML = ''; // Rensa tidigare innehåll

    wishListMovies.forEach(movie => {
        const myMovieContainerEl = document.createElement('article');
        myMovieContainerEl.classList.add('movie_card');
        myMovieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster}" alt="${movie.title}" />`;
        const myMovieTitleEl = document.createElement('h3');
        myMovieTitleEl.textContent = `${movie.title}`;
        myMovieContainerEl.appendChild(myMovieTitleEl);
        const myReleaseDateEl = document.createElement('p');
        myReleaseDateEl.textContent = `Utgivningsdatum: ${movie.release_date}`;
        myMovieContainerEl.appendChild(myReleaseDateEl);
        const myVoteAvarageEl = document.createElement('p');
        myVoteAvarageEl.textContent = `Betyg: ${movie.vote_average}`;
        myMovieContainerEl.appendChild(myVoteAvarageEl);
        // Knappar för att redigera och ta bort film från önskelistan
        const myButtonContainerEl = document.createElement('div');
        myButtonContainerEl.classList.add('button_container');
        const myButtonEl = document.createElement('button');
        myButtonEl.id = movie.id;
        myButtonEl.classList.add('deleteFromMovieWishList');
        myButtonEl.textContent = 'Ta bort';
        myButtonContainerEl.appendChild(myButtonEl);
        myMovieContainerEl.appendChild(myButtonContainerEl);
        myMoviesContainerEl.appendChild(myMovieContainerEl);
    });

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
}


// fetchMovies();

// Ändra i varje filmobjekt så den får en review eller rating
// Skapa en
