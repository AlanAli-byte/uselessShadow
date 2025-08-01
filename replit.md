# Shadow Calculator Application

## Overview

This is a full-stack web application that calculates shadow lengths based on solar position, user location, and time. The application combines scientific solar calculations with an aesthetic, minimal design to provide both accurate shadow measurements and creative interpretations. Users can input their height, location (GPS coordinates or city search), direction facing, time, and even shoe brand to get detailed shadow calculations presented in multiple units (feet, Planck lengths, light-years, horses). The app also provides "soul interpretations" based on the shadow data, creating an engaging and whimsical user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Hook Form for form handling, TanStack Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful endpoints with JSON responses
- **Data Validation**: Zod schemas for type-safe request/response validation
- **Weather Integration**: OpenWeatherMap API for real-time weather data
- **Geocoding**: City-to-coordinates conversion for location input
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Migration System**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Development Storage**: In-memory storage implementation for user data

### Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **User Storage**: Configurable storage interface supporting both memory and database backends
- **Security**: CORS and standard Express security middleware

### External Service Integrations
- **Weather API**: OpenWeatherMap for current weather conditions affecting shadow visibility
- **Geocoding Service**: OpenWeatherMap geocoding API for city search functionality
- **Mathematical Calculations**: Custom solar position algorithms using astronomical formulas
- **Shadow Interpretation**: Rule-based system for generating personality insights from shadow data

### Key Architectural Decisions

**Monorepo Structure**: The application uses a shared codebase with separate client and server directories, enabling type sharing through the `/shared` folder. This approach reduces duplication and ensures type safety across the full stack.

**Component-Based UI**: The frontend leverages a comprehensive component library (shadcn/ui) for consistent design patterns and accessibility. All components are customizable through Tailwind CSS classes and support dark/light themes.

**Type-Safe APIs**: Zod schemas define the contract between frontend and backend, ensuring runtime validation and compile-time type safety. This prevents common API integration issues and provides excellent developer experience.

**Modular Backend**: The server uses a plugin-based architecture where routes, storage, and external services are separate modules. This makes the system easy to test and extend with new features.

**Solar Calculation Engine**: The core shadow calculations use precise astronomical formulas including solar declination, equation of time, and sun altitude angles. This provides scientifically accurate results while maintaining fast performance.