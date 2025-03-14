# ERP Frontend Architecture

This document outlines the architecture and folder structure of the ERP frontend application.

## Folder Structure

```
src/
  ├── api/                 # API layer
  │   ├── endpoints/       # API endpoint definitions
  │   ├── hooks/           # TanStack Query hooks
  │   ├── utils/           # API utility functions
  │   ├── apiClient.js     # Base API client
  │   └── QueryProvider.jsx # TanStack Query provider
  ├── components/          # Reusable components
  │   ├── common/          # Common components
  │   ├── layouts/         # Layout components
  │   └── ui/              # UI components
  ├── hooks/               # Custom React hooks
  ├── pages/               # Page components
  ├── routes/              # Routing configuration
  ├── store/               # Zustand stores
  ├── utils/               # Utility functions
  ├── styles/              # Global styles
  ├── config/              # Configuration files
  ├── App.jsx              # Root component
  └── main.jsx             # Entry point
```

## Architecture

The application follows a clean architecture pattern with the following layers:

1. **API Layer**: Handles communication with the backend API

   - `endpoints/`: Contains API endpoint definitions
   - `hooks/`: Contains TanStack Query hooks for data fetching and caching
   - `utils/`: Contains utility functions for API requests
   - `apiClient.js`: Base API client using Axios
   - `QueryProvider.jsx`: TanStack Query provider

2. **UI Layer**: Handles the user interface

   - `components/`: Contains reusable components
   - `pages/`: Contains page components
   - `layouts/`: Contains layout components

3. **State Management**: Handles application state

   - `store/`: Contains Zustand stores for UI state
   - TanStack Query for server state

4. **Routing**: Handles navigation
   - `routes/`: Contains routing configuration

## State Management

The application uses a combination of state management solutions:

1. **TanStack Query**: For server state (API data)

   - Handles data fetching, caching, and synchronization
   - Provides hooks for querying and mutating data

2. **Zustand**: For UI state
   - Handles local UI state like sidebar open/closed, theme, etc.
   - Provides a simple and efficient way to manage state

## API Layer

The API layer is structured as follows:

1. **API Client**: Base client for making API requests

   - Handles authentication
   - Handles error handling
   - Provides a consistent interface for API requests

2. **API Endpoints**: Definitions for API endpoints

   - Organized by domain (auth, employees, projects, etc.)
   - Each endpoint file exports functions for making API requests

3. **API Hooks**: TanStack Query hooks for data fetching
   - Provides hooks for querying and mutating data
   - Handles caching, loading states, and error handling

## Authentication

Authentication is handled using a combination of:

1. **JWT Tokens**: Stored in localStorage
2. **Zustand Store**: Manages authentication state
3. **TanStack Query**: Fetches and updates user data
4. **Custom Hook**: Combines Zustand and TanStack Query for a unified API

## Role-Based Access Control

Role-based access control is implemented using:

1. **Role Guards**: Protect routes based on user roles
2. **Role-Based Rendering**: Conditionally render UI elements based on user roles
3. **Role Utilities**: Helper functions for checking user roles

## Best Practices

The application follows these best practices:

1. **DRY (Don't Repeat Yourself)**: Code is modular and reusable
2. **Separation of Concerns**: Each layer has a specific responsibility
3. **Type Safety**: TypeScript is used for type safety
4. **Performance**: TanStack Query for efficient data fetching and caching
5. **Maintainability**: Clean architecture for easy maintenance
6. **Scalability**: Modular structure for easy scaling
