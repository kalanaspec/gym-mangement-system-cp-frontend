export const environment = {
    production: true,
    apiUrl: 'https://iron-paradise-h4hrcfcxecaycccs.southeastasia-01.azurewebsites.net', // Your actual Azure Backend URL
    sessionTimeout: 6 * 60 * 60 * 1000, // 30 minutes in milliseconds (default)
    useCookies: true, // Use cookies for session storage instead of localStorage
    cookieName: 'sessionToken', // Cookie name for session token
    sessionExpiryCookieName: 'sessionExpiry' // Cookie name for session expiry time
};