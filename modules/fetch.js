
const API_KEY = '0bd07cd4d4166d94ef83bad8d6d24b08'; // Ersätt med din API-nyckel
const BASE_URL = 'https://api.themoviedb.org/3';


// Data från API:et
export async function fetchMovies() {
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
            movie.wish = false;
        });
        // spara svaret från API till LS
        localStorage.setItem('all_movies', JSON.stringify(data.results));
        // displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}


