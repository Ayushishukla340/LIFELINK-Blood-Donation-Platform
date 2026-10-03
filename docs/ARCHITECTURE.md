# LifeLink Architecture Overview

## System Components

### Frontend
The React application provides the user interface. Vite is used for the development server and build tooling. Axios communicates with the backend API, while React Router handles client-side navigation.

### Backend
The Node.js and Express application exposes API endpoints for account access, donor discovery, blood requests, notifications, profiles, and administrative workflows.

### Data Layer
Mongoose models define application data structures and connect the backend to MongoDB.

### Authentication and Authorization
The application uses token-based authentication. Protected operations should validate the current user's identity and enforce role-based access rules.

## Request Lifecycle

1. A user performs an action in the frontend.
2. The frontend sends an HTTP request to the backend.
3. Backend middleware validates authentication where required.
4. Route handlers validate input and apply business rules.
5. Mongoose reads or writes data in MongoDB.
6. The API returns a response to the frontend.
7. The frontend updates the relevant screen.

## Development Ports

- Frontend: commonly `5173` through Vite.
- Backend: configured for port `5000` in the current development setup.

Check the environment and project configuration if these ports differ.
