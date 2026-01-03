# Project Structure

This document describes the structure of the Angular frontend application.

## Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Feature components
│   │   │   ├── attendance/      # Attendance logging component
│   │   │   ├── dashboard/       # Dashboard with statistics
│   │   │   ├── login/           # Login component
│   │   │   ├── meal-plans/      # Meal plans management
│   │   │   ├── members/         # Members management
│   │   │   ├── navbar/          # Navigation bar
│   │   │   ├── payment-plans/   # Payment plans management
│   │   │   ├── payments/        # Payments view
│   │   │   ├── profile/         # User profile
│   │   │   ├── register/        # Registration component
│   │   │   └── reports/         # Reports component
│   │   ├── guards/              # Route guards
│   │   │   └── auth.guard.ts    # Authentication guard
│   │   ├── interceptors/        # HTTP interceptors
│   │   │   └── auth.interceptor.ts  # JWT token interceptor
│   │   ├── services/            # Services for API calls
│   │   │   ├── attendance.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── meal-plan.service.ts
│   │   │   ├── member.service.ts
│   │   │   ├── payment-plan.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── profile.service.ts
│   │   │   └── reports.service.ts
│   │   ├── app.component.ts     # Root component
│   │   ├── app.config.ts        # Application configuration
│   │   └── app.routes.ts        # Routing configuration
│   ├── models/                  # TypeScript interfaces/models
│   │   ├── attendance.model.ts
│   │   ├── member.model.ts
│   │   ├── meal-plan.model.ts
│   │   ├── payment-plan.model.ts
│   │   ├── payment.model.ts
│   │   ├── reports.model.ts
│   │   └── user.model.ts
│   ├── assets/                  # Static assets
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application entry point
│   └── styles.css               # Global styles
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                    # Project documentation
```

## Key Features

### Authentication
- Login and registration pages
- JWT token management
- Auth guard for protected routes
- HTTP interceptor for automatic token attachment

### Dashboard
- Statistics overview
- Key metrics display
- Real-time data from backend

### Member Management
- View all members
- Add new members
- Approve pending members
- Update member status
- Manage member payments

### Payment Management
- View all payments
- Payment tracking
- Payment status display

### Payment Plans
- View all payment plans
- Create new plans
- Update existing plans
- Delete plans

### Attendance
- Log member attendance
- Multiple source support (Front Desk, Mobile App, RFID)

### Meal Plans
- View all meal plans
- Create meal plans for members
- Plan text editor

### Reports
- Overall statistics
- Member reports
- Payment reports
- Attendance reports

### Profile
- View current user profile
- User information display

## API Integration

All services are configured to communicate with the backend API at:
- Base URL: `http://localhost:8080`
- API Prefix: `/api`

## Styling

The application uses Angular Material for UI components with a modern, responsive design.

