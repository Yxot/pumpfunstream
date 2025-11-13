# Design Guidelines: Click Game Web Application

## Design Approach
**Reference-Based Design** inspired by onlyclicks.fun with a modern crypto-gaming aesthetic. The design emphasizes high-energy engagement, competitive elements, and clear gamification through bold typography, bright accents against dark backgrounds, and prominent interactive elements.

## Core Design Elements

### Typography
- **Display/Hero**: Extra bold sans-serif (700-900 weight) for "$CLICK" branding and large numbers
- **Headings**: Bold sans-serif (600-700) for section titles and leaderboard headers
- **Body**: Regular sans-serif (400-500) for descriptions and secondary information
- **Numbers/Stats**: Monospace font for click counters, timers, and leaderboard positions

### Layout System
Use Tailwind spacing units: **2, 4, 6, 8, 12, 16, 20** for consistent rhythm throughout.
- Hero/main sections: py-20 to py-32
- Component padding: p-6 to p-8
- Element spacing: gap-4 to gap-8

### Color Strategy (Placeholder)
Since colors are defined later, structure assumes:
- Deep dark backgrounds
- Bright primary accent for CTAs and highlights
- Gradient effects on key text elements
- Subtle borders and dividers

## Page Structure & Components

### Hero Section (Above Fold)
**No hero image** - Focus on gamified interface elements:
- Prominent "$CLICK" logo with gradient text effect (text-6xl to text-8xl)
- Tagline: "A totally unnecessary game of greatness" (text-xl)
- **Giant Click Button**: Massive circular/rounded button (w-64 h-64) as the centerpiece, with:
  - Click animation feedback (scale transform)
  - Glow/shadow effects
  - Click counter integrated or adjacent
- Global clicks counter displayed prominently above or beside button (text-5xl, monospace)

### Live Stats Dashboard (Below Hero)
Grid layout (grid-cols-1 md:grid-cols-3):
1. **Countdown Timer Card**
   - "Next Winners In" label
   - Large countdown display (hours:minutes:seconds)
   - Monospace font for numbers
   
2. **Prize Pool Card**
   - Current prize amount
   - "$CLICK Together" messaging
   - Solana integration indicator

3. **Your Clicks Card**
   - Personal click count
   - Session statistics
   - Ticket count if purchased

### Ticket Purchase Section
Two-column layout (md:grid-cols-2):
- **Left**: Explanation of ticket system and winning mechanics
- **Right**: Ticket purchase interface with:
  - Quantity selector
  - Price display (in SOL)
  - "Buy Tickets" CTA button
  - Wallet connection status

### Leaderboard Section
Full-width container with max-w-4xl:
- "Top Clickers" heading
- Table/list format showing:
  - Rank (#1, #2, #3... with special styling for top 3)
  - Username/wallet address
  - Click count (monospace)
  - Ticket count
- Current user's position highlighted if in top 100

### Features/Benefits Section
Three-column grid (grid-cols-1 md:grid-cols-3):
1. **Join the Movement**
   - Icon (community/users)
   - "Every click matters" messaging
   
2. **$CLICK Together**
   - Icon (coins/token)
   - Token holding benefits
   
3. **Daily Prize Competitions**
   - Icon (trophy/prize)
   - Competition details

### Footer
Multi-column layout (grid-cols-2 md:grid-cols-4):
- Pump.fun integration link
- Social links (Twitter, Discord, Telegram)
- Contract address
- Quick stats summary

## Component Specifications

### Click Button
- Massive scale (min-w-64 min-h-64)
- Perfect circle or heavily rounded square
- Centered in viewport initially
- Click ripple effect
- Tactile feedback (transform: scale(0.95) on click)
- Particle/confetti burst on milestone clicks (100, 500, 1000)

### Countdown Timer
- Large monospace digits (text-4xl to text-6xl)
- Format: HH:MM:SS
- Animated seconds change
- Pulsing effect when under 1 minute remaining

### Leaderboard Rows
- Alternating background opacities for readability
- Top 3 positions with enhanced styling (larger, bolder, special icons)
- Smooth transition when rankings update
- Compact spacing (py-3 px-4)

### Ticket Purchase Cards
- Border with subtle glow effect
- Clear price display
- Input stepper for quantity selection
- Immediate feedback on purchase success

## Animations & Interactions
**Minimal but impactful**:
- Click button: Scale down on press (0.95), scale up on release with bounce
- Number counters: Smooth count-up animation for stats
- Leaderboard updates: Fade in new entries
- Timer: Subtle pulse on each second change
- Toast notifications for: clicks milestones, ticket purchases, winner announcements

## Accessibility
- Click button has large touch target (minimum 64px)
- Keyboard navigation for ticket purchase
- Screen reader labels for all interactive elements
- Clear focus states on all inputs and buttons
- Timer updates announced to screen readers

## Mobile Optimization
- Stack all multi-column layouts to single column
- Click button scales proportionally (min-w-48 min-h-48 on mobile)
- Fixed positioning for click counter overlay
- Sticky timer countdown at top on scroll
- Drawer/modal for leaderboard on smaller screens

## Technical Notes
- Real-time click synchronization (WebSocket or polling)
- Local storage for user session clicks
- Optimistic UI updates for instant feedback
- Mock Solana wallet connection for prototype