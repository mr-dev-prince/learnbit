<!-- BEGIN:nextjs-agent-rules -->

# Agent Instructions for Learnbit Development

This document provides AI agents with comprehensive context about the Learnbit application, its architecture, conventions, and development guidelines.

## Project Overview

**Learnbit** is a full-stack Next.js application designed as a learning platform. The project follows modern web development practices with TypeScript, React, Tailwind CSS, ESLint, and Prettier.

## Technology Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Database**: [To be configured based on requirements]
- **Authentication**: [To be configured based on requirements]

## Project Structure

```
learnbit/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── api/                # API routes
│   └── ...
├── components/             # Reusable React components
│   ├── ui/                 # UI components
│   └── ...
├── lib/                    # Utility functions and helpers
│   ├── utils.ts            # Common utilities
│   └── ...
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── styles/                 # Global styles
├── ai-context/             # Agent context and documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── API_STRUCTURE.md     # API endpoints structure
│   ├── COMPONENT_PATTERNS.md # React component patterns
│   ├── DATABASE.md          # Database schema and queries
│   └── CONVENTIONS.md       # Coding conventions and standards
├── public/                 # Static files
├── .prettierrc              # Prettier config
├── .prettierignore          # Prettier ignore rules
├── eslint.config.mjs        # ESLint config (flat config)
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
├── package.json             # Dependencies and scripts
└── CONTRIBUTION.md          # Contribution guidelines
```

## Development Conventions

### Code Style

1. **TypeScript**: Use strict TypeScript with proper types
   - Avoid `any` type
   - Use interfaces for component props
   - Use enums for constants

2. **React Components**
   - Use functional components with hooks
   - Use PascalCase for component names
   - Use camelCase for function and variable names
   - Keep components focused and single-responsibility

3. **Naming Conventions**
   - `components/`: PascalCase (e.g., `UserCard.tsx`)
   - `hooks/`: camelCase with `use` prefix (e.g., `useUserData.ts`)
   - `lib/`: camelCase (e.g., `formatDate.ts`)
   - `types/`: PascalCase (e.g., `User.ts`)

### File Organization

**Components should be organized as:**

```
components/
├── ui/                  # Generic UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── layout/              # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ...
└── features/            # Feature-specific components
    ├── Dashboard.tsx
    └── ...
```

### Styling Guidelines

- Use Tailwind CSS classes for all styling
- Create custom utility classes in `globals.css` if needed
- Use CSS modules for component-scoped styles only when necessary
- Follow consistent spacing patterns (Tailwind's spacing scale)
- Use color palette defined in Tailwind config

### Import Aliases

The project is configured with import aliases (as per `tsconfig.json`):

- `@/` - Points to project root

Example usage:

```typescript
import { Button } from '@/components/ui/Button';
import { useUserData } from '@/hooks/useUserData';
import type { User } from '@/types/User';
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
3. Push to your fork and create a Pull Request
4. Follow commit message format in CONTRIBUTION.md

## Available Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Linting & Formatting
npm run lint             # Run ESLint check
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier

# Type Checking
npx tsc --noEmit         # Check TypeScript types
```

## Common Development Patterns

### Creating a New Page

1. Create a file in `app/` directory
2. Use the appropriate route structure (App Router)
3. Export a default component

Example: `app/dashboard/page.tsx`

```typescript
export default function Dashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    </main>
  );
}
```

### Creating a New Component

Example: `components/ui/Card.tsx`

```typescript
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="rounded-lg border bg-white p-4 shadow-md">
    <h2 className="mb-2 text-lg font-semibold">{title}</h2>
    {children}
  </div>
);
```

### Creating a Custom Hook

Example: `hooks/useUserData.ts`

```typescript
import { useState, useEffect } from 'react';
import type { User } from '@/types/User';

export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
  }, [userId]);

  return { user, loading };
};
```

## API Development

- API routes should be in `app/api/` directory
- Use Next.js API route structure
- Follow RESTful conventions
- Document endpoints in `ai-context/API_STRUCTURE.md`

## Environment Variables

Create a `.env.local` file in the root directory for local development:

```
# Database
DATABASE_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# API Keys
API_KEY=
```

## Before Making Changes

Before implementing a feature:

1. Check the relevant context files in `ai-context/`
2. Review `CONTRIBUTION.md` for guidelines
3. Check if similar patterns exist in the codebase
4. Create a feature branch with a descriptive name

## Important Notes

- This is a Next.js 16+ project with the latest features
- Always run `npm run lint` before committing
- Always use `npm run format` to format code before submitting PR
- TypeScript strict mode is enabled
- No JavaScript files (.js) - use TypeScript (.ts/.tsx) only

## For Agents Implementing Features

When implementing a new feature:

1. Read the relevant context files in `ai-context/`
2. Follow the naming conventions and file organization
3. Use TypeScript with proper typing
4. Add JSDoc comments for complex functions
5. Run linting and formatting before completion
6. Update relevant documentation if needed

---

**Last Updated**: 2026
<!-- END:nextjs-agent-rules -->
