# $CLICK Game - Replit Agent Guide

## Overview

$CLICK is a gamified web application that combines clicking mechanics with Solana blockchain integration. Users compete in a global clicking competition to win SOL cryptocurrency from daily prize pools. The application features real-time statistics, leaderboards, and a ticket-based lottery system integrated with the $CLICK token on Solana.

**Core Concept**: A "totally unnecessary game of greatness" where users click to earn points, purchase lottery tickets with their clicks, and compete for daily SOL prizes. Token holders on Solana can grow the prize pool.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: 
- Shadcn/ui components (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode by default with custom color system using HSL values
- Framer Motion for animations and interactions

**Design Philosophy**:
- Reference-based design inspired by onlyclicks.fun
- Crypto-gaming aesthetic with bold typography and high-energy engagement
- No hero images - focus on gamified interface elements
- Giant click button as the centerpiece with animation feedback
- Monospace fonts for numbers/stats, bold sans-serif for headings

**State Management**:
- TanStack React Query for server state and API interactions
- Local state with React hooks
- LocalStorage for persisting user authentication
- WebSocket for real-time updates

**Routing**: Wouter for lightweight client-side routing

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful endpoints with real-time WebSocket support

**Key Endpoints**:
- `/api/register` - User registration with Solana address
- `/api/click` - Increment user clicks
- `/api/purchase-tickets` - Convert clicks to lottery tickets
- `/api/user` - Fetch user data
- `/api/stats` - Global game statistics
- `/api/leaderboard` - Top players ranking
- `/ws` - WebSocket connection for real-time updates

**Real-time Communication**:
- WebSocket server using ws library
- Broadcasts for stats updates, leaderboard changes, and online user counts
- Client connection tracking with userId mapping

**Session Management**: 
- User data stored in memory (MemStorage implementation)
- LocalStorage-based authentication on client
- No traditional session cookies currently implemented

### Data Storage

**Current Implementation**: In-memory storage using MemStorage class

**Schema Design** (Drizzle ORM with PostgreSQL dialect):
- **users table**: 
  - id (varchar, primary key, UUID)
  - name (text)
  - solanaAddress (text, unique) - User's Solana wallet address
  - clicks (integer, default 0)
  - tickets (integer, default 0)
  - createdAt (timestamp)

**Storage Interface Pattern**: IStorage interface defines contract for data operations, allowing easy swap from MemStorage to actual database implementation

**Migration Path**: Configured for PostgreSQL via Drizzle Kit, ready to migrate from in-memory to persistent database when DATABASE_URL is provided

### External Dependencies

**Blockchain Integration**:
- Solana blockchain for $CLICK token integration
- User registration requires valid Solana wallet address (32-44 characters)
- Prize pool mechanism tied to Solana token holders
- Integration points in place for pump.fun token platform

**Database (Configured)**:
- PostgreSQL via Neon Database serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database operations
- Session storage via connect-pg-simple (for future implementation)

**UI Libraries**:
- Radix UI primitives for accessible components
- Framer Motion for animations
- React Hook Form with Zod validation
- Date-fns for date formatting
- Lucide React for icons
- React Icons for Solana logo (SiSolana)

**Development Tools**:
- TypeScript for type safety across client and server
- Vite for fast development and optimized builds
- ESBuild for server bundling
- Replit-specific plugins for development experience

**Key Game Mechanics**:
- Global click counter shared across all users
- Individual user click tracking
- Ticket purchase system: 1,000 clicks per ticket
- Prize pool starts at 0.05 SOL and grows randomly (0.01-0.11 SOL per ticket purchase)
- Prize pool with countdown timer (24-hour cycles)
- Live online user tracking
- Real-time leaderboard updates

**Security Considerations**:
- Solana address validation on registration
- UUID-based user identification
- Input validation using Zod schemas
- CORS and credential handling in API requests