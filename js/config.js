// API Configuration
const CONFIG = {
    // Base API URL
    API_URL: 'http://localhost:5000/api',

    // API Endpoints
    ENDPOINTS: {
        QUESTIONS: '/questions',
        ANSWERS: '/answers',
        UPLOAD: '/upload',
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register'
        }
    },

    // API Version
    API_VERSION: 'v1',

    // Request Timeouts (in milliseconds)
    TIMEOUT: 5000,

    // Pagination defaults
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10
    },

    // Authentication
    AUTH_TOKEN_KEY: 'stackit_auth_token',

    // Date formatting
    DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',

    // Current environment
    ENV: 'development'
};

// Request Headers
CONFIG.DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// Helper function to get auth token
CONFIG.getAuthToken = () => localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);

// Helper function to set auth token
CONFIG.setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
    }
};

// Helper function to build full API URL
CONFIG.buildApiUrl = (endpoint) => '${CONFIG.API_URL}${endpoint}';

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}