// Search Functionality
class NetflixSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchBox = document.getElementById('search-box');
        this.allMovies = [];
        this.init();
    }

    async init() {
        await this.loadMovieData();
        this.setupEventListeners();
    }

    async loadMovieData() {
        try {
            // In a real app, this would be an API call
            this.allMovies = [
                // Trending movies
                ...movieData.trending,
                // Popular movies
                ...movieData.popular,
                // Continue watching
                ...movieData.continue
            ];
        } catch (error) {
            console.error('Error loading movie data:', error);
            this.allMovies = [];
        }
    }

    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('focus', () => this.activateSearch());
        this.searchInput.addEventListener('blur', () => this.deactivateSearch());
        this.searchInput.addEventListener('input', 
            NetflixUtils.debounce((e) => this.handleSearch(e.target.value), 300)
        );

        // Click outside to close results
        document.addEventListener('click', (e) => {
            if (!this.searchBox.contains(e.target)) {
                this.hideResults();
            }
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }

    activateSearch() {
        this.searchBox.classList.add('active');
        this.showResults();
    }

    deactivateSearch() {
        setTimeout(() => {
            if (!this.searchInput.matches(':focus')) {
                this.searchBox.classList.remove('active');
                this.hideResults();
            }
        }, 200);
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showRecentSearches();
            return;
        }

        const results = this.searchMovies(query);
        this.displayResults(results, query);
    }

    searchMovies(query) {
        const searchTerm = query.toLowerCase().trim();
        
        return this.allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm) ||
            (movie.cast && movie.cast.toLowerCase().includes(searchTerm)) ||
            (movie.description && movie.description.toLowerCase().includes(searchTerm))
        );
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item no-results">
                    <i class="fas fa-search"></i>
                    <span>No results found for "${query}"</span>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.slice(0, 10).map(movie => `
                <div class="search-result-item" data-movie-id="${movie.id}">
                    <img src="${movie.image}" alt="${movie.title}" 
                         onerror="this.src='images/placeholder.jpg'">
                    <div class="search-result-info">
                        <div class="search-result-title">${movie.title}</div>
                        <div class="search-result-meta">
                            ${movie.year} • ${movie.genre}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.addResultEventListeners();
        this.showResults();
    }

    showRecentSearches() {
        const recentSearches = NetflixUtils.storage.get('recentSearches') || [];
        
        if (recentSearches.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item no-results">
                    <i class="fas fa-clock"></i>
                    <span>No recent searches</span>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = `
                <div class="search-result-header">Recent Searches</div>
                ${recentSearches.map(term => `
                    <div class="search-result-item recent-search" data-search-term="${term}">
                        <i class="fas fa-clock"></i>
                        <span>${term}</span>
                    </div>
                `).join('')}
                <div class="search-result-footer">
                    <button class="clear-recent">Clear recent searches</button>
                </div>
            `;

            this.addRecentSearchEventListeners();
        }

        this.showResults();
    }

    addResultEventListeners() {
        const resultItems = this.searchResults.querySelectorAll('.search-result-item:not(.no-results)');
        
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const movieId = item.dataset.movieId;
                this.selectMovie(movieId);
            });
        });
    }

    addRecentSearchEventListeners() {
        const recentSearches = this.searchResults.querySelectorAll('.recent-search');
        const clearButton = this.searchResults.querySelector('.clear-recent');

        recentSearches.forEach(item => {
            item.addEventListener('click', () => {
                const searchTerm = item.dataset.searchTerm;
                this.searchInput.value = searchTerm;
                this.handleSearch(searchTerm);
            });
        });

        if (clearButton) {
            clearButton.addEventListener('click', (e) => {
                e.stopPropagation();
                NetflixUtils.storage.set('recentSearches', []);
                this.showRecentSearches();
            });
        }
    }

    handleKeyNavigation(e) {
        const results = this.searchResults.querySelectorAll('.search-result-item:not(.no-results)');
        if (results.length === 0) return;

        let currentIndex = -1;
        
        results.forEach((item, index) => {
            if (item.classList.contains('selected')) {
                currentIndex = index;
                item.classList.remove('selected');
            }
        });

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % results.length;
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0) {
                    results[currentIndex].click();
                }
                return;
            default:
                return;
        }

        if (currentIndex >= 0) {
            results[currentIndex].classList.add('selected');
            results[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    selectMovie(movieId) {
        const movie = this.allMovies.find(m => m.id == movieId);
        if (movie) {
            this.addToRecentSearches(movie.title);
            this.hideResults();
            this.searchInput.value = '';
            // Navigate to movie detail page
            console.log('Selected movie:', movie);
        }
    }

    addToRecentSearches(term) {
        let recentSearches = NetflixUtils.storage.get('recentSearches') || [];
        recentSearches = recentSearches.filter(t => t !== term);
        recentSearches.unshift(term);
        recentSearches = recentSearches.slice(0, 5);
        NetflixUtils.storage.set('recentSearches', recentSearches);
    }

    showResults() {
        this.searchResults.classList.add('active');
    }

    hideResults() {
        this.searchResults.classList.remove('active');
    }

    // Public method to update movie data
    updateMovieData(newMovies) {
        this.allMovies = newMovies;
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetflixSearch;
}