# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with host binding for network access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check with svelte-check and sync
- `npm run check:watch` - Type check in watch mode
- `npm run format` - Format code with Prettier
- `npm run fix` - Auto-fix ESLint issues
- `npm run lint` - Check formatting and linting (runs prettier --check and eslint)
- `npm run test:unit` - Run unit tests with Vitest in watch mode
- `npm run test` - Run unit tests once

## Database Commands

- `npm run db:push` - Push schema changes to database
- `npm run db:push:test` - Push schema changes to test database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for production database
- `npm run db:studio:test` - Open Drizzle Studio for test database

## Architecture Overview

This is a **SvelteKit** money management application with the following stack:

- **Frontend**: SvelteKit with Svelte 5, TailwindCSS, shadcn-svelte UI components
- **Database**: PostgreSQL with Drizzle ORM (snake_case naming convention)
- **Authentication**: Custom session-based auth with Oslo crypto utilities
- **Testing**: Vitest for unit tests (server-side only)
- **Deployment**: Node.js adapter

### Key Directory Structure

- `src/lib/server/` - Server-side code (database, sessions, auth)
  - `db/` - Database schema and connection
  - `service/` - Business logic (sessions, users, cookies)
- `src/lib/components/` - Reusable Svelte components
  - `ui/` - shadcn-svelte UI components
  - `budget/`, `header/`, `transaction/` - Feature-specific components
- `src/routes/` - SvelteKit file-based routing
  - `app/` - Main application routes (protected)
  - `demo/` - Demo/public routes

### Database Schema

Three main tables:
- `session` - User sessions with expiry
- `transactions` - Financial transactions with automatic week calculation
- `budget` - Weekly budget allocations

User configuration is defined in `src/lib/config.ts` as a const array (currently Hugo and Cassie).

### Authentication Flow

- Session-based authentication using Oslo crypto
- Sessions stored in PostgreSQL with expiry
- User enum enforced at database level
- Server-side session validation in `hooks.server.ts`

### Component Architecture

- Uses shadcn-svelte for consistent UI components
- Feature components organized by domain (budget, transactions, etc.)
- Form handling with native SvelteKit forms
- Drawer/modal patterns for editing interfaces

### Testing Setup

- Vitest configured for server-side testing only
- Test environment loads test-specific environment variables
- Database tests use separate test database
- Tests located in `src/lib/server/service/test/`

### Development Notes

- TailwindCSS v4 with vite plugin
- Uses `cross-env` for cross-platform environment variables
- Drizzle Kit for database schema management
- ESLint with Prettier integration and perfectionist plugin for import sorting