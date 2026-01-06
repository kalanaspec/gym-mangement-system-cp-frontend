export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080', // Or whatever your local backend runs on
    sessionTimeout: 6 * 60 * 60 * 1000, // 30 minutes in milliseconds (default)
    useCookies: true, // Use cookies for session storage instead of localStorage
    cookieName: 'sessionToken', // Cookie name for session token
    sessionExpiryCookieName: 'sessionExpiry' // Cookie name for session expiry time
};