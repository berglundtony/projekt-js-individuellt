import { checkMovies } from './modules/dom.js';
let seenMoviesBool = false;

checkMovies(seenMoviesBool);
// displayMyMovies();



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
    // displayMyMovies();
}




// fetchMovies();

// Ändra i varje filmobjekt så den får en review eller rating
// Skapa en
