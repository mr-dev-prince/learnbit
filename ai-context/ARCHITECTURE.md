# Architecture Overview

## System Architecture

Learnbit follows a modern full-stack Next.js architecture with clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
│  ├─ React Components (App Router)                          │
│  ├─ Pages (app/)                                           │
│  ├─ Client Components                                       │
│  └─ UI Components                                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────┐
│                   Next.js API Layer                          │
│  ├─ API Routes (app/api/)                                  │
│  ├─ Server Actions                                         │
│  └─ Middleware                                             │
└────────────────────────┬────────────────────────────────────┘
                         │ Database Queries
┌────────────────────────▼────────────────────────────────────┐
│                  Data Layer                                 │
│  ├─ Database (TBD)                                         │
│  ├─ ORM/Query Builder (TBD)                                │
│  └─ Data Models                                            │
└─────────────────────────────────────────────────────────────┘
```

## Project Layers

### 1. Presentation Layer (`app/` and `components/`)

- **Pages**: Route pages defined in `app/` directory
- **Components**: Reusable React components in `components/`
- **Layouts**: Layout wrappers for consistent UI structure
- **Client/Server Split**: Use `'use client'` directive for interactive components

### 2. Business Logic Layer (`lib/` and `hooks/`)

- **Utilities**: Helper functions in `lib/`
- **Custom Hooks**: Business logic in React hooks in `hooks/`
- **Server Actions**: Server-side logic in route handlers

### 3. Data Layer (`app/api/`)

- **API Routes**: RESTful endpoints for data operations
- **Database Interactions**: Queries and mutations
- **Authentication**: User authentication and authorization

## Component Hierarchy

```
Root Layout (app/layout.tsx)
├── Header Component
├── Navigation Component
├── Page Routes
│   ├── Dashboard Page
│   │   ├── Dashboard Widgets
│   │   └── Data Components
│   └── Other Pages
└── Footer Component
```

## Data Flow

### Client to Server

1. **User Action** → Component event handler
2. **Component State Update** → Re-render
3. **API Call** → Fetch from `/api/*` endpoint
4. **Data Processing** → Server processes request
5. **Database Query** → Data retrieved/stored
6. **Response** → JSON response to client

### Server to Client

1. **Initial Request** → Next.js server
2. **Page Rendering** → Server-side rendering (SSR) or Static (SSG)
3. **Component Tree** → React components rendered
4. **HTML Response** → Sent to client
5. **Hydration** → Client takes over interactivity

## Technology Integration Points

### Next.js Features Used

- **App Router**: Modern routing system
- **API Routes**: Backend endpoints
- **Server Components**: Default for reduced JavaScript
- **Client Components**: For interactivity
- **Image Optimization**: Next.js Image component
- **Built-in Middleware**: For authentication/logging

### External Integrations (TBD)

- **Database**: Configuration pending
- **Authentication**: Setup pending
- **File Storage**: Configuration pending
- **Third-party APIs**: To be documented

## Scalability Considerations

- **Component-based**: Easy to scale with new features
- **API-driven**: Backend can be replaced/upgraded
- **Modular structure**: Clean separation of concerns
- **TypeScript**: Type safety for large codebases

---

See also: API_STRUCTURE.md, COMPONENT_PATTERNS.md, DATABASE.md
