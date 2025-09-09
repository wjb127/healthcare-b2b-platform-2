# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Healthcare B2B Platform - A B2B trading platform for the healthcare industry with Clinical Teal theme design system.

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend Ready**: Supabase (authentication and database integration ready)

## Essential Commands

```bash
# Development
npm run dev        # Start development server (default port 3000)

# Build & Production
npm run build      # Build for production (must pass before deployment)
npm start          # Start production server

# Code Quality
npm run lint       # Run ESLint checks

# Component Management
npx shadcn@latest add [component-name]  # Add new shadcn/ui components
```

## Architecture & Key Design Patterns

### Clinical Teal Theme System
The app uses a custom Clinical Teal color theme defined in CSS variables:
- Primary: Teal (#0EA5A4, hover #0F766E, subtle #5EEAD4)
- Accent: Blue (#2563EB, hover #1D4ED8)
- Background: #F8FAFC, Surface: #FFFFFF, Border: #E2E8F0
- Text: Default #0F172A, Secondary #475569, Disabled #94A3B8

CSS variables are defined in `src/app/globals.css` and consumed via Tailwind config.

### Component Structure

**Landing Page Components** (`src/components/landing/`)
- `Hero.tsx`: Contains RoleSwitcher for buyer/seller/admin roles
- `Features.tsx`: 6 core features showcase
- `CTA.tsx`: Registration form with dynamic field addition
- `Footer.tsx`: Company information and links

**Bidding System** (`src/components/bidding/`)
- `BiddingForm.tsx`: Main form with validation, file upload integration, and bid history table
- `FilterPanel.tsx`: Search, status, date range, price filters with CSV/XLSX export
- `FileUploadArea.tsx`: Drag-and-drop file upload with visual feedback
- `WeightedScoring.tsx`: Slider-based scoring system with real-time calculation

**Key Implementation Patterns**:
1. All client-interactive components use `"use client"` directive
2. Forms use controlled components with React state
3. Animations use Framer Motion with subtle transitions
4. Status badges have specific color coding (open/closed/awarded)
5. Tables include score column with pulse animation on change

### State Management Patterns

- Form state: Local React state with validation
- Filter state: Lifted to parent component (BiddingForm)
- Score calculation: Uses `useMemo` for performance
- Auto-close bids: `useEffect` with interval checking

### Styling Patterns

- Tailwind utility classes for styling
- shadcn/ui components for consistent UI
- Custom slider styling via global CSS injection
- Focus states: Primary Teal border (#0EA5A4)
- Hover states: Darker shade transitions
- Disabled states: Gray (#94A3B8)

## Critical Implementation Notes

### Next.js Specific
- Use `Link` from `next/link` for internal navigation (not `<a>` tags)
- Images should use `next/image` component
- Metadata defined in layout.tsx

### TypeScript Considerations
- Bid status types: `"submitted" | "accepted" | "rejected" | "pending" | "open" | "closed" | "awarded"`
- Component props interfaces defined above components
- Event handlers properly typed

### Build Requirements
- All ESLint errors must be resolved for successful build
- Unused variables/imports will cause build failures
- TypeScript strict mode is enabled

### Deployment
- Deployed on Vercel
- Environment variables for Supabase (when integrated) should be added to Vercel dashboard
- Build command: `npm run build`
- Output directory: `.next`

## Common Development Tasks

### Adding New shadcn/ui Components
```bash
npx shadcn@latest add [component]
```
Components are automatically placed in `src/components/ui/`

### Modifying Theme Colors
Edit CSS variables in `src/app/globals.css` (lines 46-79 for light mode, 81-113 for dark mode)

### Adding New Routes
Create new folders under `src/app/` with `page.tsx` files

## Important File Locations

- Theme configuration: `src/app/globals.css`, `tailwind.config.ts`
- Component library: `src/components/ui/`
- Business logic: `src/components/bidding/`, `src/components/landing/`
- Type definitions: Inline with components
- Utility functions: `src/lib/utils.ts`