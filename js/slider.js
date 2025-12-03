// Movie Slider Functionality
class MovieSlider {
    constructor(containerId, movies, category) {
        this.container = document.getElementById(containerId);
        this.movies = movies;
        this.category = category;
        this.currentScroll = 0;
        this.init();
    }

    init() {
        this.createSlider();
        this.addEventListeners();
    }

    createSlider() {
        // Create slider structure
        this.container.innerHTML = `
            <div class="row-header">
                <h2 class="row-title">${this.category}</h2>
                <a href="#" class="row-see-all">See All</a>
            </div>
            <div class="movie-slider">
                <button class="slider-btn slider-left" aria-label="Previous movies">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="slider-container" id="${this.category.toLowerCase().replace(' ', '-')}-movies">
                    ${this.movies.map(movie => this.createMovieCard(movie)).join('')}
                </div>
                <button class="slider-btn slider-right" aria-label="Next movies">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        this.sliderContainer = this.container.querySelector('.slider-container');
        this.leftBtn = this.container.querySelector('.slider-left');
        this.rightBtn = this.container.querySelector('.slider-right');

        this.updateButtonStates();
    }

    createMovieCard(movie) {
        const progressBar = movie.progress ? `
            <div class="movie-progress">
                <div class="movie-progress-bar" style="width: ${movie.progress}%"></div>
            </div>
        ` : '';

        return `
            <div class="movie-card" data-movie-id="${movie.id}">
                <img src="${movie.image}" alt="${movie.title}" class="movie-card-image" 
                     onerror="this.src='images/placeholder.jpg'">
                <div class="movie-card-info">
                    <div class="movie-card-title">${movie.title}</div>
                    <div class="movie-card-meta">
                        ${movie.year} • ${movie.rating} • ${movie.genre}
                    </div>
                    <div class="movie-card-actions">
                        <button class="movie-card-btn play-btn" aria-label="Play ${movie.title}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="movie-card-btn info-btn" aria-label="More info about ${movie.title}">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                    ${progressBar}
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Scroll buttons
        this.leftBtn.addEventListener('click', () => this.scrollLeft());
        this.rightBtn.addEventListener('click', () => this.scrollRight());

        // Mouse wheel scrolling
        this.sliderContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.sliderContainer.scrollLeft += e.deltaY;
        });

        // Update button states on scroll
        this.sliderContainer.addEventListener('scroll', () => {
            this.updateButtonStates();
        });

        // Touch events for mobile
        let startX;
        let scrollLeft;

        this.sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = this.sliderContainer.scrollLeft;
        });

        this.sliderContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            this.sliderContainer.scrollLeft = scrollLeft - walk;
        });

        // Movie card interactions
        this.container.addEventListener('click', (e) => {
            const movieCard = e.target.closest('.movie-card');
            if (movieCard) {
                const movieId = movieCard.dataset.movieId;
                this.handleMovieClick(movieId);
            }

            const playBtn = e.target.closest('.play-btn');
            if (playBtn) {
                e.stopPropagation();
                const movieId = playBtn.closest('.movie-card').dataset.movieId;
                this.playMovie(movieId);
            }

            const infoBtn = e.target.closest('.info-btn');
            if (infoBtn) {
                e.stopPropagation();
                const movieId = infoBtn.closest('.movie-card').dataset.movieId;
                this.showMovieInfo(movieId);
            }
        });
    }

    scrollLeft() {
        const scrollAmount = this.sliderContainer.clientWidth * 0.8;
        this.sliderContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }

    scrollRight() {
        const scrollAmount = this.sliderContainer.clientWidth * 0.8;
        this.sliderContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    updateButtonStates() {
        const scrollLeft = this.sliderContainer.scrollLeft;
        const maxScroll = this.sliderContainer.scrollWidth - this.sliderContainer.clientWidth;

        this.leftBtn.disabled = scrollLeft <= 0;
        this.rightBtn.disabled = scrollLeft >= maxScroll;
    }

    handleMovieClick(movieId) {
        console.log('Movie clicked:', movieId);
        // Implement movie detail view
    }

    playMovie(movieId) {
        console.log('Play movie:', movieId);
        // Implement play functionality
    }

    showMovieInfo(movieId) {
        console.log('Show info for movie:', movieId);
        // Implement movie info modal
    }

    // Update movies in slider
    updateMovies(newMovies) {
        this.movies = newMovies;
        const moviesContainer = this.container.querySelector('.slider-container');
        moviesContainer.innerHTML = this.movies.map(movie => this.createMovieCard(movie)).join('');
        this.updateButtonStates();
    }
}

// Initialize all sliders
class SliderManager {
    constructor() {
        this.sliders = new Map();
    }

    createSlider(containerId, movies, category) {
        const slider = new MovieSlider(containerId, movies, category);
        this.sliders.set(containerId, slider);
        return slider;
    }

    getSlider(containerId) {
        return this.sliders.get(containerId);
    }

    updateAllSliders(movieData) {
        this.sliders.forEach((slider, containerId) => {
            const category = containerId.replace('-slider', '').replace('-', ' ');
            if (movieData[category]) {
                slider.updateMovies(movieData[category]);
            }
        });
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MovieSlider, SliderManager };
}