# AI Context Directory

This directory contains comprehensive documentation and guidelines for AI agents working on the Learnbit project.

## Purpose

The files in this directory serve as a knowledge base for AI agents to understand:

- The project architecture and structure
- API design patterns and conventions
- React component patterns and best practices
- Database schema and relationships
- Coding standards and naming conventions

## Files

### [ARCHITECTURE.md](./ARCHITECTURE.md)

Comprehensive overview of the system architecture, layers, component hierarchy, and technology stack. Read this first to understand the big picture.

### [API_STRUCTURE.md](./API_STRUCTURE.md)

Detailed guide to API design, route organization, response formats, status codes, and implementation patterns for Next.js API routes.

### [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md)

React component patterns including functional components, compound components, custom hooks, context patterns, and form components. Essential for implementing UI components.

### [DATABASE.md](./DATABASE.md)

Database schema, data models, relationships, SQL examples, and query patterns. Reference this when working with data models or database-related features.

### [CONVENTIONS.md](./CONVENTIONS.md)

Coding standards, naming conventions, TypeScript best practices, styling guidelines, and comment/documentation standards. Follow these for code consistency.

## How to Use

1. **Before Starting**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the project structure
2. **For Component Work**: Reference [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md)
3. **For API Work**: Use [API_STRUCTURE.md](./API_STRUCTURE.md)
4. **For Styling**: Check [CONVENTIONS.md](./CONVENTIONS.md) for Tailwind CSS guidelines
5. **For Database**: Refer to [DATABASE.md](./DATABASE.md)

## Quick Reference

### Project Structure

```
learnbit/
├── app/               # Next.js App Router pages
├── components/        # Reusable React components
├── lib/              # Utility functions
├── types/            # TypeScript types
├── hooks/            # Custom React hooks
├── styles/           # Global styles
├── ai-context/       # This directory
└── public/           # Static assets
```

### Tech Stack

- **Framework**: Next.js 16+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint + Prettier

### Available Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run lint          # Check code quality
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
```

## Key Principles

1. **Type Safety**: Always use TypeScript with proper typing
2. **Component Isolation**: Keep components small and focused
3. **Reusability**: Extract common patterns into utilities
4. **Consistency**: Follow naming conventions and patterns
5. **Documentation**: Add JSDoc for complex functions

## Contributing

When adding new features or making changes:

1. Follow the patterns documented in COMPONENT_PATTERNS.md
2. Adhere to conventions in CONVENTIONS.md
3. Run `npm run lint:fix` and `npm run format` before committing
4. Update this documentation if you change architecture or patterns

---

For more information, see [AGENTS.md](../AGENTS.md) and [CONTRIBUTION.md](../CONTRIBUTION.md) at the project root.
