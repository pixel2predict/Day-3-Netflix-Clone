// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Netflix Clone application
    const netflixApp = new NetflixApp();
    netflixApp.init();
});

class NetflixApp {
    constructor() {
        this.movieData = {};
        this.sliderManager = new SliderManager();
        this.search = null;
        this.currentUser = null;
    }

    async init() {
        try {
            await this.loadMovieData();
            this.initializeComponents();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.checkAuthentication();
            
            console.log('Netflix Clone initialized successfully');
        } catch (error) {
            console.error('Error initializing Netflix Clone:', error);
        }
    }

    async loadMovieData() {
        // Simulate API call
        this.movieData = {
            trending: [
                {
                    id: 1,
                    title: "Stranger Things",
                    image: "images/thumbnails/stranger-things.jpg",
                    year: 2024,
                    rating: "TV-14",
                    genre: "Sci-Fi & Horror"
                },
                {
                    id: 2,
                    title: "The Witcher",
                    image: "images/thumbnails/witcher.jpg",
                    year: 2023,
                    rating: "TV-MA",
                    genre: "Fantasy"
                },
                {
                    id: 3,
                    title: "Breaking Bad",
                    image: "images/thumbnails/breaking-bad.jpg",
                    year: 2013,
                    rating: "TV-MA",
                    genre: "Crime Drama"
                },
                {
                    id: 4,
                    title: "The Crown",
                    image: "images/thumbnails/crown.jpg",
                    year: 2023,
                    rating: "TV-MA",
                    genre: "Historical Drama"
                },
                {
                    id: 5,
                    title: "Money Heist",
                    image: "images/thumbnails/money-heist.jpg",
                    year: 2021,
                    rating: "TV-MA",
                    genre: "Crime Drama"
                },
                {
                    id: 6,
                    title: "Dark",
                    image: "images/thumbnails/dark.jpg",
                    year: 2020,
                    rating: "TV-MA",
                    genre: "Sci-Fi & Thriller"
                }
            ],
            popular: [
                {
                    id: 7,
                    title: "Wednesday",
                    image: "images/thumbnails/wednesday.jpg",
                    year: 2023,
                    rating: "TV-14",
                    genre: "Comedy & Horror"
                },
                {
                    id: 8,
                    title: "Squid Game",
                    image: "images/thumbnails/squid-game.jpg",
                    year: 2021,
                    rating: "TV-MA",
                    genre: "Thriller"
                },
                {
                    id: 9,
                    title: "The Queen's Gambit",
                    image: "images/thumbnails/queens-gambit.jpg",
                    year: 2020,
                    rating: "TV-MA",
                    genre: "Drama"
                },
                {
                    id: 10,
                    title: "Bridgerton",
                    image: "images/thumbnails/bridgerton.jpg",
                    year: 2022,
                    rating: "TV-MA",
                    genre: "Romance"
                },
                {
                    id: 11,
                    title: "Ozark",
                    image: "images/thumbnails/ozark.jpg",
                    year: 2022,
                    rating: "TV-MA",
                    genre: "Crime Drama"
                },
                {
                    id: 12,
                    title: "The Sandman",
                    image: "images/thumbnails/sandman.jpg",
                    year: 2022,
                    rating: "TV-MA",
                    genre: "Fantasy"
                }
            ],
            continue: [
                {
                    id: 13,
                    title: "You",
                    image: "images/thumbnails/you.jpg",
                    year: 2023,
                    rating: "TV-MA",
                    genre: "Psychological Thriller",
                    progress: 65
                },
                {
                    id: 14,
                    title: "Black Mirror",
                    image: "images/thumbnails/black-mirror.jpg",
                    year: 2023,
                    rating: "TV-MA",
                    genre: "Sci-Fi & Thriller",
                    progress: 30
                },
                {
                    id: 15,
                    title: "The Last of Us",
                    image: "images/thumbnails/last-of-us.jpg",
                    year: 2023,
                    rating: "TV-MA",
                    genre: "Action & Drama",
                    progress: 80
                },
                {
                    id: 16,
                    title: "Better Call Saul",
                    image: "images/thumbnails/better-call-saul.jpg",
                    year: 2022,
                    rating: "TV-MA",
                    genre: "Crime Drama",
                    progress: 45
                },
                {
                    id: 17,
                    title: "Peaky Blinders",
                    image: "images/thumbnails/peaky-blinders.jpg",
                    year: 2022,
                    rating: "TV-MA",
                    genre: "Crime Drama",
                    progress: 20
                },
                {
                    id: 18,
                    title: "The Mandalorian",
                    image: "images/thumbnails/mandalorian.jpg",
                    year: 2023,
                    rating: "TV-14",
                    genre: "Sci-Fi & Action",
                    progress: 90
                }
            ]
        };

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    initializeComponents() {
        this.initializeSliders();
        this.initializeSearch();
        this.initializeUserInterface();
    }

    initializeSliders() {
        // Create sliders for each category
        const mainContent = document.getElementById('main-content');
        
        const categories = [
            { id: 'trending-slider', title: 'Trending Now', data: this.movieData.trending },
            { id: 'popular-slider', title: 'Popular on Netflix', data: this.movieData.popular },
            { id: 'continue-slider', title: 'Continue Watching', data: this.movieData.continue },
            { id: 'top-slider', title: 'Top Picks for You', data: this.movieData.trending },
            { id: 'drama-slider', title: 'Dramas', data: this.movieData.popular },
            { id: 'action-slider', title: 'Action & Adventure', data: this.movieData.trending }
        ];

        categories.forEach(category => {
            const section = NetflixUtils.createElement('section', {
                class: 'movie-row',
                id: category.id
            });
            
            mainContent.appendChild(section);
            this.sliderManager.createSlider(category.id, category.data, category.title);
        });
    }

    initializeSearch() {
        this.search = new NetflixSearch();
    }

    initializeUserInterface() {
        this.setupHeaderEffects();
        this.setupMobileMenu();
        this.setupProfileDropdown();
    }

    setupEventListeners() {
        // Window scroll for header effect
        window.addEventListener('scroll', NetflixUtils.debounce(() => {
            this.handleScroll();
        }, 10));

        // Resize observer for responsive adjustments
        window.addEventListener('resize', NetflixUtils.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Service worker for PWA (optional)
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Lazy load images if needed
                    this.lazyLoadImages(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe movie cards for lazy loading
        document.querySelectorAll('.movie-card').forEach(card => {
            observer.observe(card);
        });
    }

    handleScroll() {
        const header = document.getElementById('header');
        const scrolled = window.scrollY > 100;
        
        header.classList.toggle('scrolled', scrolled);

        // Parallax effect for hero section
        const hero = document.getElementById('hero');
        const scrolled2 = window.pageYOffset;
        const parallaxSpeed = 0.5;
        hero.style.transform = `translateY(${scrolled2 * parallaxSpeed}px)`;
    }

    handleResize() {
        // Adjust slider behavior on resize
        this.sliderManager.sliders.forEach(slider => {
            slider.updateButtonStates();
        });

        // Handle mobile menu state
        this.handleMobileMenuState();
    }

    handleKeyboardShortcuts(e) {
        // '/' to focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            this.search.searchInput.focus();
        }

        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
            this.closeAllDropdowns();
        }
    }

    setupHeaderEffects() {
        const header = document.getElementById('header');
        
        // Add scroll effect
        window.addEventListener('scroll', NetflixUtils.debounce(() => {
            const scrolled = window.scrollY > 100;
            header.classList.toggle('scrolled', scrolled);
        }, 10));
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const body = document.body;

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close mobile menu when clicking on links
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    setupProfileDropdown() {
        const profile = document.getElementById('profile');
        const dropdownMenu = document.getElementById('dropdown-menu');

        profile.addEventListener('click', (e) => {
            e.stopPropagation();
            profile.parentElement.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            profile.parentElement.classList.remove('active');
        });
    }

    handleMobileMenuState() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.profile-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        this.search.hideResults();
        this.search.searchBox.classList.remove('active');
    }

    lazyLoadImages(element) {
        const images = element.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registered: ', registration);
        } catch (error) {
            console.log('ServiceWorker registration failed: ', error);
        }
    }

    checkAuthentication() {
        // Check if user is logged in (simulated)
        this.currentUser = NetflixUtils.storage.get('currentUser');
        
        if (!this.currentUser) {
            // Show login modal or redirect
            console.log('User not authenticated');
        }
    }

    // Method to update movie data dynamically
    updateMovieData(newData) {
        this.movieData = { ...this.movieData, ...newData };
        this.sliderManager.updateAllSliders(this.movieData);
        
        if (this.search) {
            const allMovies = [
                ...this.movieData.trending,
                ...this.movieData.popular,
                ...this.movieData.continue
            ];
            this.search.updateMovieData(allMovies);
        }
    }

    // Method to handle user interactions
    handleUserInteraction(type, data) {
        switch (type) {
            case 'play_movie':
                this.playMovie(data.movieId);
                break;
            case 'add_to_list':
                this.addToMyList(data.movieId);
                break;
            case 'rate_movie':
                this.rateMovie(data.movieId, data.rating);
                break;
            default:
                console.log('Unknown interaction:', type);
        }
    }

    playMovie(movieId) {
        console.log('Playing movie:', movieId);
        // Implement actual play functionality
    }

    addToMyList(movieId) {
        let myList = NetflixUtils.storage.get('myList') || [];
        if (!myList.includes(movieId)) {
            myList.push(movieId);
            NetflixUtils.storage.set('myList', myList);
            console.log('Added to My List:', movieId);
        }
    }

    rateMovie(movieId, rating) {
        let ratings = NetflixUtils.storage.get('ratings') || {};
        ratings[movieId] = rating;
        NetflixUtils.storage.set('ratings', ratings);
        console.log('Rated movie:', movieId, rating);
    }
}

// Global movie data (would normally come from API)
const movieData = {
    trending: [
        {
            id: 1,
            title: "Stranger Things",
            image: "images/thumbnails/stranger-things.jpg",
            year: 2024,
            rating: "TV-14",
            genre: "Sci-Fi & Horror",
            description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments."
        },
        {
            id: 2,
            title: "The Witcher",
            image: "images/thumbnails/witcher.jpg",
            year: 2023,
            rating: "TV-MA",
            genre: "Fantasy",
            description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny."
        },
        {
            id: 3,
            title: "Breaking Bad",
            image: "images/thumbnails/breaking-bad.jpg",
            year: 2013,
            rating: "TV-MA",
            genre: "Crime Drama",
            description: "A high school chemistry teacher diagnosed with cancer turns to a life of crime."
        }
    ],
    popular: [
        {
            id: 4,
            title: "Wednesday",
            image: "images/thumbnails/wednesday.jpg",
            year: 2023,
            rating: "TV-14",
            genre: "Comedy & Horror",
            description: "Follows Wednesday Addams' years as a student, when she attempts to solve a murder mystery."
        },
        {
            id: 5,
            title: "Squid Game",
            image: "images/thumbnails/squid-game.jpg",
            year: 2021,
            rating: "TV-MA",
            genre: "Thriller",
            description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games."
        }
    ],
    continue: [
        {
            id: 6,
            title: "You",
            image: "images/thumbnails/you.jpg",
            year: 2023,
            rating: "TV-MA",
            genre: "Psychological Thriller",
            progress: 65
        },
        {
            id: 7,
            title: "The Last of Us",
            image: "images/thumbnails/last-of-us.jpg",
            year: 2023,
            rating: "TV-MA",
            genre: "Action & Drama",
            progress: 80
        }
    ]
};