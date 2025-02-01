const MovieStorage = {
    getMovies(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    saveMovies(key, movies) {
        localStorage.setItem(key, JSON.stringify(movies));
    },

    addMovie(key, movie) {
        let movies = this.getMovies(key);
        if (!movies.some(m => m.id === movie.id)) {
            movies.push(movie);
        }
        this.saveMovies(key, movies);
    },

    removeMovie(key, movieId) {
        let movies = this.getMovies(key);
        movies = movies.filter(m => m.id !== movieId);
        this.saveMovies(key, movies);
    },

    syncSeenMovies() {
        let allMovies = this.getMovies('all_movies');
        let seenMovies = this.getMovies('seen_movies');

        // Markera alla filmer som "seen" baserat på `seen_movies`
        allMovies = allMovies.map(movie => ({
            ...movie,
            seen: seenMovies.some(seenMovie => seenMovie.id === movie.id)
        }));

        this.saveMovies('all_movies', allMovies);
        return allMovies;
    }
};

export default MovieStorage;