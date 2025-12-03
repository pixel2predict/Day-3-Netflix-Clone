// Configuration settings
const CONFIG = {
    API_BASE_URL: 'https://api.example.com',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    DEFAULT_LANGUAGE: 'en-US',
    AUTO_PLAY_PREVIEW: true,
    ENABLE_AUTOPLAY: false,
    VIDEO_QUALITY: 'hd1080',
    MAX_SEARCH_RESULTS: 10,
    CACHE_DURATION: 3600000, // 1 hour in milliseconds
    FEATURES: {
        SEARCH: true,
        MY_LIST: true,
        CONTINUE_WATCHING: true,
        RATINGS: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}