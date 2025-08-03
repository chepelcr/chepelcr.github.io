# José Pablo Campos Solano - Portfolio Website

## Overview

This is a personal portfolio website for José Pablo Campos Solano, a backend software developer specializing in Java (Spring Boot) and Python. The application showcases his professional experience, skills, projects, and provides a contact form for potential clients or employers. The website is built as a full-stack application with a React frontend and Express.js backend, featuring a modern, responsive design with a dark theme optimized for developer portfolios.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with a single-page application structure
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark navy color scheme with green accents
- **State Management**: TanStack Query (React Query) for server state management and API data fetching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features and type safety
- **API Design**: Simple REST API with a contact form endpoint for form submissions
- **Development Setup**: Hot module replacement in development with production-ready build process

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL with Neon Database serverless integration
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **In-Memory Storage**: Temporary memory storage implementation for development/demonstration purposes

### Authentication and Authorization
- **Current State**: No authentication system implemented (portfolio website doesn't require user accounts)
- **Session Management**: Basic session infrastructure prepared with connect-pg-simple for future enhancements

### Design System and UI/UX
- **Component Library**: Comprehensive shadcn/ui components for consistent design patterns
- **Responsive Design**: Mobile-first approach with responsive navigation and layouts
- **Accessibility**: Built-in accessibility features through Radix UI primitives
- **Typography**: Inter font family with Fira Code for code elements

### Development Workflow
- **Monorepo Structure**: Organized with separate client, server, and shared directories
- **Code Quality**: TypeScript strict mode enabled with comprehensive type checking
- **Build Process**: Separate build processes for frontend (Vite) and backend (esbuild)
- **Development Server**: Integrated development server with API proxy and hot reloading

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, and React Query for modern React development
- **UI Components**: Radix UI primitives, Lucide React icons, and shadcn/ui component system
- **Styling**: Tailwind CSS, class-variance-authority for component variants, and clsx for conditional classes
- **Form Handling**: React Hook Form with Hookform resolvers for form validation
- **Development**: Vite with React plugin and runtime error overlay for enhanced development experience

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support and ES modules
- **Database**: Drizzle ORM with Neon Database serverless driver for PostgreSQL operations
- **Session Management**: Connect-pg-simple for PostgreSQL session storage capabilities
- **Development Tools**: TSX for TypeScript execution and esbuild for production bundling

### Build and Development Tools
- **Package Management**: NPM with package-lock.json for dependency version locking
- **TypeScript**: Comprehensive TypeScript configuration with path mapping and strict type checking
- **Build Tools**: Vite for frontend, esbuild for backend, with separate development and production configurations
- **Database Tools**: Drizzle Kit for database migrations and schema management

### Third-Party Services
- **Database Hosting**: Neon Database for serverless PostgreSQL hosting
- **Email Services**: Prepared infrastructure for email notifications (not yet implemented)
- **CDN/Assets**: Unsplash for placeholder images and Google Fonts for typography
- **Development Platform**: Optimized for Replit deployment with specific plugins and configurations