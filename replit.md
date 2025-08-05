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
- **Email Services**: Amazon SES configured and fully functional for contact form submissions
- **CDN/Assets**: Unsplash for placeholder images and Google Fonts for typography
- **Development Platform**: Optimized for Replit deployment with specific plugins and configurations

## GitHub Pages Deployment Setup

### Deployment Configuration
- **GitHub Actions Workflow**: Automated deployment pipeline configured in `.github/workflows/deploy.yml`
- **Static Build Process**: Custom build script (`build-gh-pages.sh`) for GitHub Pages compatible static site generation
- **Contact Form Adaptation**: Modified contact form to use mailto links for static hosting compatibility
- **Base Path Configuration**: Set to work with root domain deployment (`/`) for jcampos.dev
- **Custom Domain**: CNAME file configured for https://jcampos.dev/ deployment

### Deployment Features
- **Automated CI/CD**: Deploys automatically on push to dev branch
- **Static Site Optimization**: Removes server dependencies while maintaining full frontend functionality
- **Email Integration**: Contact form opens default email client with pre-filled message
- **PDF Generation**: CV download functionality works in static environment
- **Custom Domain Support**: Configured for chepelcr.github.io repository with jcampos.dev domain

## Recent Changes (January 2025)

### Language and Translation System
- **Complete Translation Implementation**: All sections now fully translate between Spanish and English
- **Experience Section**: Added comprehensive translations for job titles, descriptions, company names, and time periods
- **Education Section**: Improved layout alignment and added translations for education degrees including "International Baccalaureate Diploma Programme"
- **Consistent Card Heights**: Fixed layout alignment issues in education section with consistent minimum heights for titles
- **UI Improvements**: Enhanced certification verification buttons with full-width styling and better spacing

### Technical Improvements
- **Complete Translation System**: All sections now fully translated including languages proficiency levels in about section
- **Translation Context**: Comprehensive language context with 100+ translation keys covering all UI elements
- **Layout Consistency**: Fixed alignment issues in education cards caused by varying title lengths
- **Error Resolution**: Resolved duplicate translation keys and mapping function errors
- **Component Architecture**: Implemented dynamic data functions that accept translation context for localized content
- **Professional Experience Timeline**: Implemented complete timeline design with begin circle, experience icons, and precise line alignment

### URL-Based Routing System (January 2025)
- **Language-Prefixed URLs**: Implemented `/es` and `/en` URL prefixes for bilingual navigation
- **Section-Based Routing**: URLs show current section (e.g., `/es/about`, `/en/projects`)
- **Navigation Integration**: All navigation elements use URL-based routing with smooth scrolling
- **URL Sync**: Current language and section automatically sync with browser URL
- **Deep Linking**: Direct access to specific sections via URL (e.g., `/en/contact`)
- **Fallback Handling**: Root URL (`/`) redirects to saved language preference
- **Active States**: Navigation items highlight based on current URL section
- **Scroll-Based URL Updates**: URLs automatically update based on scroll position using Intersection Observer
- **Natural Scroll Behavior**: Manual scrolling controls URL updates without automatic section jumping
- **Single-Click Navigation**: Fixed double-click issues for immediate navigation response
- **Optimized Scroll Detection**: 40% visibility threshold for accurate section detection across all sections

### UI/UX Enhancements (January 2025)
- **Theme and Language Toggles**: Enhanced both selectors with visual feedback for active selection
- **Smooth Transitions**: Implemented fade effects for theme changes and slide animations for language switching
- **Contact Button Fix**: Added proper scrolling functionality to hero section contact button
- **GitHub Pages Routing**: Fixed 404 errors on page reload with proper client-side routing support
- **Prevented Unnecessary Transitions**: Language and theme selectors now prevent transitions when clicking already selected options

### Projects Section Update (January 2025)
- **Video Transcription Tool**: Added new main project featuring AI-powered video transcription
- **Language-Aware Routing**: Project links automatically route to `/video-transcript/es` or `/video-transcript/en`
- **Project Restructuring**: Removed AI Microservice from "Others" section, reorganized project hierarchy
- **Complete Translations**: Added comprehensive Spanish and English translations for video transcription features
- **Modern Tech Stack**: Updated project technologies to include React, TypeScript, AI Services, and Web APIs