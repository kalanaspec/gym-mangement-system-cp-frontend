# Gym Management System - Frontend

This is the Angular frontend application for the Gym Management System.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Build

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Features

- User Authentication (Login/Register)
- Dashboard with statistics
- Member Management
- Payment Management
- Payment Plans Management
- Attendance Logging
- Meal Plans Management
- Reports Generation
- User Profile

## Backend API

The frontend expects the backend API to be running at `http://localhost:8080`

Make sure to update the API URL in the service files if your backend is running on a different port.

## Session Management

The application includes automatic session management with configurable timeout. Sessions are managed using cookies (configurable).

### Configuration

Session settings can be configured in the environment files (`environment.ts`, `environment.dev.ts`, `environment.prod.ts`):

```typescript
export const environment = {
  // ... other config
  sessionTimeout: 30 * 60 * 1000,        // Session timeout in milliseconds (default: 30 minutes)
  useCookies: true,                       // Use cookies for session storage (default: true)
  cookieName: 'sessionToken',            // Cookie name for session token
  sessionExpiryCookieName: 'sessionExpiry' // Cookie name for session expiry time
};
```

### Session Timeout Examples

- **15 minutes**: `sessionTimeout: 15 * 60 * 1000`
- **30 minutes**: `sessionTimeout: 30 * 60 * 1000` (default)
- **1 hour**: `sessionTimeout: 60 * 60 * 1000`
- **2 hours**: `sessionTimeout: 2 * 60 * 60 * 1000`

### Features

- Automatic session expiration monitoring
- Automatic redirect to login page when session expires
- Session validation on every HTTP request
- Activity tracking (optional extension on user activity)
- Cookie-based session storage (configurable to use localStorage)
- Session expiry warnings (5 minutes before expiration)

### How It Works

1. When a user logs in, a session is created with the configured timeout
2. The session is monitored continuously
3. If the session expires, the user is automatically logged out and redirected to the login page
4. All HTTP requests check session validity before execution

