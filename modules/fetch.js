const API_KEY = '0bd07cd4d4166d94ef83bad8d6d24b08'; // Ersätt med din API-nyckel
const BASE_URL = 'https://api.themoviedb.org/3';
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY }&language=sv-SE`;


// Data från API:et
export async function fetchMovies(page) {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=sv-SE&page=${page}&&sort_by=release_date`);
        if (!response.ok) {
            throw new Error('Error status:', response.status);
        }
        const data = await response.json();
        // ändra i varje filmobjekt, så den får review och rating
        // loopa över listan
        console.log("data", data)
        data.results.forEach(movie => {
            movie.seen = false;
            movie.rating = 0;
            movie.wish = false;
        });
        // spara svaret från API till LS
        localStorage.setItem('all_movies', JSON.stringify(data.results));
        // console.log(data.results);
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

export async function fetchGenres() {
        const response = await fetch(genreUrl);
        const data = await response.json();
        console.log('Genrer:', data.genres);
}
    
async function fetchMoviesByGenre(genreId) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY }&with_genres=${genreId}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Filmer:', data.results);
}

const genre = fetchMoviesByGenre(28);
console.log(genre);



