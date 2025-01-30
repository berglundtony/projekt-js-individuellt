import { fetchMovies } from './fetch.js';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let _allMovies = [];
let _seenMovies = [];
let seenMoviesBool = false;

// Hämta alla flikknappar och innehåll
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Ta bort active-klassen från alla flikar
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Lägg till active-klassen på den valda fliken
        button.classList.add('active');
        const tabName = button.getAttribute('data-tab');
        document.getElementById(button.dataset.tab).classList.add('active');
        console.log(`Klickade på fliken: ${tabName}`);
        if (tabName === "popular") {
            console.log("Visar populära filmer");
            window.location.reload();
            const tabContent = document.getElementById('seen');
            console.log(tabContent);
            tabContent.classList.remove('active');
           
        }
        if (tabName === "wishlist") {

        }
        if (tabName === "seen") {
            seenMoviesBool = true;
            console.log("Visar sedda filmer");
            const tabContent = document.getElementsByClassName('tab-content')[2];
            tabContent.classList.add('active');
            checkMovies(seenMoviesBool);
        }
    });
});

// Sätt rätt flik på sidladdning
// window.addEventListener('load', () => {
//     const currentTab = window.location.hash.replace('#', '') || 'popular';
//     const activeButton = document.querySelector(`.tab-button[data-tab="${currentTab}"]`);
//     if (activeButton) {
//         activeButton.classList.add('active');
//         document.getElementById(currentTab).classList.add('active');
//     }
// });


export async function checkMovies(seenMoviesBool) {
    // Kolla om det redan finns filmer i localstorage
    const movies = JSON.parse(localStorage.getItem('all_movies')) || [];
    _seenMovies = JSON.parse(localStorage.getItem('seen_movies'));
    if (!seenMoviesBool) {
        console.log('movies:', movies);
        if (movies.length > 0) {
            displayMovies(movies, seenMoviesBool);
        }
        else {
            fetchMovies();
            _allMovies = JSON.parse(localStorage.getItem('all_movies'));
            displayMovies(_allMovies, seenMoviesBool);
        }
    }
    else {
        if (_seenMovies.length > 0) {
            console.warn("Inga filmer hittades i localStorage.");
        }
        console.log('Seen movies:', _seenMovies);
        if (_seenMovies) {
            // I så fall: rendera till LS.
            displayMovies(_seenMovies, seenMoviesBool);
        }
        else {
            const tabContent = document.getElementsByClassName('tab-content')[2];
            tabContent.classList.add('active');
            _seenMovies = JSON.parse(localStorage.getItem('seen_movies'));
            displayMovies(_seenMovies, seenMoviesBool);
        }
    }

}

// Funktion för att visa filmer i DOM
function displayMovies(movies, seenMoviesBool) {
    let moviesContainerEl = '';
    if (seenMoviesBool) {
        moviesContainerEl = document.getElementById('seenMoviesDisplay');
    } else {
        moviesContainerEl = document.getElementById('movies');
    }
  
    moviesContainerEl.innerHTML = ''; // Rensa tidigare innehåll

    if (movies.length > 0) {
        movies.forEach(movie => {
            makeCard(movie, moviesContainerEl);
        });
    }

  
}


async function makeCard(movie, moviesContainerEl) {

    const movieContainerEl = document.createElement('article');
    // På min artikel vill jag ha en eventlyssnare
    movieContainerEl.addEventListener('click', function () {
        console.log('click:', movie.id);
        window.location.href = `/movieDetail.html?id=${movie.id}&title=${encodeURIComponent(movie.title)}`;
    });

    movieContainerEl.classList.add('movie_card');
    movieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}" />`;

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

    const buttonContainerEl = document.createElement('div');
    buttonContainerEl.classList.add('button_container');

    const spanTextDescribingButtonEl = document.createElement('span');
    spanTextDescribingButtonEl.textContent = 'Lägg till i din önskelista:';

    const buttonEl = document.createElement('button');
    buttonEl.id = movie.id;
    buttonEl.classList.add('addMovieWishList');
    buttonEl.textContent = 'Lägg till';

    buttonEl.addEventListener('click', function () {
        const id = buttonEl.getAttribute('id');
        console.log('id:', id);
        addToMyMovieList(id);
    })

    movieContainerEl.appendChild(movieTitleEl);
    movieContainerEl.appendChild(releaseDateEl);
    movieContainerEl.appendChild(voteAvarageEl);
    movieContainerEl.appendChild(ratingEl);
    movieContainerEl.appendChild(seenEl);
    buttonContainerEl.appendChild(spanTextDescribingButtonEl);
    buttonContainerEl.appendChild(buttonEl);
    movieContainerEl.appendChild(buttonContainerEl);
    moviesContainerEl.appendChild(movieContainerEl);
};

// Hantera mina filmer

function displayMyMovies() {
    // const wishListMovies = JSON.parse(localStorage.getItem("myMovieList"));
    // console.log('wishListMovies:', wishListMovies);

    // const myMoviesContainerEl = document.getElementById('myMovies');
    // myMoviesContainerEl.innerHTML = ''; 

    // wishListMovies.forEach(movie => {
    //     const myMovieContainerEl = document.createElement('article');
    //     myMovieContainerEl.classList.add('movie_card');
    //     myMovieContainerEl.innerHTML = `<img src="${IMAGE_BASE_URL}${movie.poster}" alt="${movie.title}" />`;
    //     const myMovieTitleEl = document.createElement('h3');
    //     myMovieTitleEl.textContent = `${movie.title}`;
    //     myMovieContainerEl.appendChild(myMovieTitleEl);
    //     const myReleaseDateEl = document.createElement('p');
    //     myReleaseDateEl.textContent = `Utgivningsdatum: ${movie.release_date}`;
    //     myMovieContainerEl.appendChild(myReleaseDateEl);
    //     const myVoteAvarageEl = document.createElement('p');
    //     myVoteAvarageEl.textContent = `Betyg: ${movie.vote_average}`;
    //     myMovieContainerEl.appendChild(myVoteAvarageEl);
    //     // Knappar för att redigera och ta bort film från önskelistan
    //     const myButtonContainerEl = document.createElement('div');
    //     myButtonContainerEl.classList.add('button_container');
    //     const myButtonEl = document.createElement('button');
    //     myButtonEl.id = movie.id;
    //     myButtonEl.classList.add('deleteFromMovieWishList');
    //     myButtonEl.textContent = 'Ta bort';
    //     myButtonContainerEl.appendChild(myButtonEl);
    //     myMovieContainerEl.appendChild(myButtonContainerEl);
    //     myMoviesContainerEl.appendChild(myMovieContainerEl);
    // });

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