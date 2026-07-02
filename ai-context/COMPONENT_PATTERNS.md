# React Component Patterns

## Component Structure

All React components in Learnbit follow functional component patterns with TypeScript.

## Basic Component Pattern

```typescript
// components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

/**
 * Button component - A reusable button with variants
 * @param props - Button properties
 * @returns Button element
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded font-semibold transition ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};
```

## Compound Component Pattern

For complex components with multiple related pieces:

```typescript
// components/Card.tsx
import React from 'react';

// Main Card component
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border bg-white shadow-md">{children}</div>
);

// Header sub-component
Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b px-6 py-4">{children}</div>
);

// Body sub-component
Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

// Footer sub-component
Card.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="border-t bg-gray-50 px-6 py-4">{children}</div>
);

// Usage:
// <Card>
//   <Card.Header>Title</Card.Header>
//   <Card.Body>Content</Card.Body>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
```

## Custom Hook Pattern

```typescript
// hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for handling async operations
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately
 * @returns State object with data, loading, and error
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): UseAsyncState<T> & { execute: () => Promise<void> } => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute };
};
```

## Client/Server Component Pattern

### Server Component (Default)

```typescript
// app/dashboard/page.tsx
import { getUser } from '@/lib/user';

export default async function Dashboard() {
  const user = await getUser();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <UserStats userId={user.id} />
    </div>
  );
}
```

### Client Component

```typescript
// components/UserStats.tsx
'use client';

import { useState, useEffect } from 'react';

interface UserStatsProps {
  userId: string;
}

export const UserStats: React.FC<UserStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/stats`);
        const data = await response.json();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Display stats */}</div>;
};
```

## Context Pattern

```typescript
// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import type { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Form Component Pattern

```typescript
// components/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded bg-red-100 p-2 text-red-600">{error}</div>}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading} variant="primary">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};
```

## Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useFetch.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `parseJSON.ts`)
- **Types/Interfaces**: PascalCase (`User.ts`, `ButtonProps`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)

## Component Organization

```
components/
├── ui/                  # Generic UI components (reusable)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── layout/              # Layout components (structure)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/            # Feature-specific components
    ├── Dashboard.tsx
    ├── UserProfile.tsx
    └── CourseCard.tsx
```

## Common Props Pattern

```typescript
interface BaseComponentProps {
  /** Additional CSS classes */
  className?: string;
  /** Test ID for testing */
  testId?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

interface ButtonProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}
```

---

See also: ARCHITECTURE.md, CONVENTIONS.md
