import { checkMovies } from './dom.js';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let moviesFromLs = [];
let currentMovie = {};
let seenMoviesBool = false;

export async function onPageLoad() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
  
    // Hämta filmen från LS.
    moviesFromLs = JSON.parse(localStorage.getItem('all_movies')) || [];
    console.log(moviesFromLs);
    if (moviesFromLs.length > 0) {
        currentMovie = moviesFromLs.find((element) => String(element.id) === id); 
        if (currentMovie) {
            console.log('Hittad film:', currentMovie);
            renderMovieToUI(currentMovie);
        } else {
            console.warn('Ingen film hittades med id:', id);
        }
    } else {
        console.warn('Inga filmer finns i localStorage');
    }
}

onPageLoad();

// Hämta alla flikknappar och innehåll
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');


tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Ta bort active-klassen från alla flikar
        tabButtons.forEach(btn => btn.classList.remove('active'));
     

        // Lägg till active-klassen på den valda fliken
       
        const tabName = button.getAttribute('data-tab');
        document.getElementById(button.dataset.tab).classList.add('active');
    
        if (tabName === "popular") {
            console.log("Visar populära filmer");
            window.location.reload();
            button.classList.add('active');
            checkMovies(seenMoviesBool);
        }
        if (tabName === "wishlist") {

        }
        if (tabName === "seen") {
            seenMoviesBool = true;
            console.log("Visar sedda filmer");
            // Navigera utan att ladda om sidan
            window.history.pushState({}, '', `index.html#${tabName}`);
            const tabContent = document.getElementsByClassName('tab-content')[2];
            tabContent.classList.add('active');
            // const pageDetailWrapper = document.getElementsByClassName('.page_detail_wrapper');
            // pageDetailWrapper.style.display = none;
            checkMovies(seenMoviesBool);
        }
    });
});


async function renderMovieToUI() {
    const movieImageEl = document.getElementById('movie-image');
    movieImageEl.setAttribute("src", `${IMAGE_BASE_URL}${currentMovie.poster_path }`);
    movieImageEl.setAttribute("alt", `Movie poster of ${currentMovie.title}`);
    document.getElementById('header-title').innerText = currentMovie.title;
    document.getElementById('movie-rating').innerText = `Betyg: ${ currentMovie.vote_average }`;
    document.getElementById('movie-rtRating').innerText = '';
    document.getElementById('movie-description').innerText = currentMovie.overview;
};

// skapa eventlyssnare för när man togglar checkboxen för 'seen'
const seenCheckboxEl = document.getElementById('seenCb');
console.log(seenCheckboxEl);
seenCheckboxEl.addEventListener("click", (e) => {
    currentMovie.seenCb = e.target.checked;
    console.log(currentMovie);
    // uppdatera vårt filmobjekt i LS
    // hitta vilket index vår film är på i moviesFromLs-listan
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    // nu kan vi byta ut "gamla" filmobjektet till det nya
    moviesFromLs.splice(index, 1, currentMovie);
    localStorage.setItem("all_movies", JSON.stringify(moviesFromLs));
    console.log(moviesFromLs);

    // hantera sett-listan (seen_movies) i LS
    // kika om seen_movies ens finns
    const seenmoviesFromLs = JSON.parse(localStorage.getItem("seen_movies") || "[]");
    if (currentMovie.seen) {
        // nu vill vi lägga in filmen i seen_movies i LS
        seenmoviesFromLs.push(currentMovie);
        console.log(seenmoviesFromLs);
        // uppdaterar LS seen_movies
        localStorage.setItem("seen_movies", JSON.stringify(seenmoviesFromLs));
    } else {
        // hitta index för vart filmen ligger någonstans
        const index = seenmoviesFromLs.findIndex((m) => m.id === currentMovie.id);
        seenmoviesFromLs.splice(index, 1);
        console.log(seenmoviesFromLs);
        // uppdaterar LS seen_movies
        localStorage.setItem("seen_movies", JSON.stringify(moviesFromLs));
    }
});

function handleSeenClicked(e) {
    // ändra i vår currentMovie om användaren klickat att denne sett eller ej
    if (e) {
        currentMovie.seenCb = e.target.checked;
    }

    // uppdatera vårt filmobjekt i LS
    // hitta vilket index vår film är på i moviesFromLs-listan
    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    // nu kan vi byta ut "gamla" filmobjektet till det nya
    moviesFromLs.splice(index, 1, currentMovie);
    localStorage.setItem("seen_movies", JSON.stringify(moviesFromLs));
    const seenMoviesFromLS = JSON.parse(localStorage.getItem("seen-movies") || '[]');
    // hantera sett-listan (seen_movies) i LS
    if (currentMovie.seenCb) {  
        seenMoviesFromLS.push(currentMovie);
        console.log(seenMoviesFromLS);
        localStorage.setItem('seen_movies', JSON.stringify(seenMoviesFromLS));
    }
    else {
        // Ta bort att man sett filmen, alltså klicka ur checkboxen.
        const index = seenMoviesFromLS.findIndex((m) => m.id === currentMovie.id);
        seenMoviesFromLS.splice(index, 1);
        console.log(seenMoviesFromLS);
        localStorage.setItem("seen_movies", JSON.stringify(seenmoviesFromLS));
    }
};

// ändra värde på vår rating
document.getElementById("movie-rating-select").addEventListener("change", (e) => {
    const rating = e.target.value;

    // uppdatera currentMovie med nya ratingen
    currentMovie.rating = rating;
    // har man ej klickat i att man sett filmen, men ratear, då sätter vi filmen till sedd
    if (!currentMovie.seen) {
        currentMovie.seen = true;
        // uppdatera elementet
        seenCheckboxEl.checked = true;
        handleSeenClicked();
    }

    const index = moviesFromLs.findIndex((m) => m.id === currentMovie.id);
    // uppdatera lokala listan med nya ratingen
    moviesFromLs.splice(index, 1, currentMovie);
    // uppdaterar LS all_movies
    localStorage.setItem('all_movies', JSON.stringify(moviesFromLs));
    // uppdatera UI med nya ratingen:
    document.getElementById('movie-rtRating').innerText = `Mitt betyg: ${rating}/5`;
});