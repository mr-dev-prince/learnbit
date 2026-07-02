# Coding Conventions & Standards

## Code Style

### TypeScript

1. **Type Definitions**
   - Use explicit types whenever possible
   - Avoid `any` type - use `unknown` if necessary
   - Use `Record<K, V>` instead of object with string keys
   - Use `type` for type aliases, `interface` for object shapes

   ```typescript
   // ✅ Good
   interface User {
     id: string;
     name: string;
   }

   type Status = 'active' | 'inactive';
   const data: Record<string, number> = {};

   // ❌ Avoid
   interface User {
     id: any;
     name: any;
   }
   const data: any = {};
   ```

2. **Null and Undefined Handling**
   - Prefer explicit handling over optional chaining in business logic
   - Use optional chaining for defensive programming

   ```typescript
   // ✅ Good
   if (user && user.profile) {
     console.log(user.profile.name);
   }

   // Shorthand when appropriate
   const name = user?.profile?.name;
   ```

3. **Constants**
   - Use `const` by default
   - Define constants at module level
   - Use UPPER_SNAKE_CASE for constants

   ```typescript
   // ✅ Good
   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

   // ❌ Avoid
   const max_file_size = 5 * 1024 * 1024;
   let maxFileSize = 5 * 1024 * 1024;
   ```

### JavaScript/TypeScript Naming

1. **Variables and Functions**
   - Use camelCase for variables and functions
   - Use PascalCase for classes and components
   - Use descriptive names that explain purpose

   ```typescript
   // ✅ Good
   const getUserData = async (userId: string) => {};
   const isUserActive = true;
   class UserService {}
   const Button: React.FC = () => {};

   // ❌ Avoid
   const get_user_data = async (uid: string) => {};
   const active = true;
   const btn = () => {};
   ```

2. **File Names**
   - Components: PascalCase (`Button.tsx`, `UserCard.tsx`)
   - Utilities: camelCase (`formatDate.ts`, `parseJSON.ts`)
   - Types: PascalCase (`User.ts`, `Theme.ts`)
   - Hooks: camelCase (`useAuth.ts`, `useFetch.ts`)

   ```
   ✅ Good
   components/Button.tsx
   lib/formatDate.ts
   types/User.ts
   hooks/useAuth.ts

   ❌ Avoid
   components/button.tsx
   lib/format-date.ts
   types/user.ts
   hooks/use-auth.ts
   ```

## React/Next.js Conventions

### Component Structure

1. **Component Organization**

   ```typescript
   // 1. Imports
   import React from 'react';
   import { Button } from '@/components/ui/Button';

   // 2. Types/Interfaces
   interface CardProps {
     title: string;
     children: React.ReactNode;
   }

   // 3. Component
   export const Card: React.FC<CardProps> = ({ title, children }) => {
     return <div>{title}</div>;
   };

   // 4. Exports (if additional)
   export default Card;
   ```

2. **Props Naming**
   - Use descriptive prop names
   - Group related props
   - Use boolean prefix convention (is*, has*, can*, should*)

   ```typescript
   // ✅ Good
   interface ButtonProps {
     isDisabled?: boolean;
     isPrimary?: boolean;
     hasIcon?: boolean;
     onClick: () => void;
   }

   // ❌ Avoid
   interface ButtonProps {
     disabled?: boolean;
     primary?: boolean;
   }
   ```

3. **Component Composition**
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

   ```typescript
   // ✅ Good - Small, focused component
   const UserName: React.FC<{ name: string }> = ({ name }) => (
     <span className="font-semibold">{name}</span>
   );

   const UserCard: React.FC<{ user: User }> = ({ user }) => (
     <Card>
       <UserName name={user.name} />
       <p>{user.email}</p>
     </Card>
   );
   ```

### Hooks

1. **Custom Hook Naming**
   - All hooks start with `use`
   - Descriptive name explaining what data/functionality they provide

   ```typescript
   // ✅ Good
   const useUserData = (userId: string) => {};
   const useLocalStorage = (key: string) => {};
   const useDebounce = (value: string, delay: number) => {};

   // ❌ Avoid
   const fetchUserData = (userId: string) => {};
   const getUserData = (userId: string) => {};
   ```

2. **Hook Dependencies**
   - Always specify dependency arrays
   - Use ESLint plugin to catch missing dependencies

   ```typescript
   // ✅ Good
   useEffect(() => {
     console.log(userId);
   }, [userId]);

   // ❌ Avoid
   useEffect(() => {
     console.log(userId);
   }); // Missing dependency array
   ```

### Server vs Client Components

1. **Server Components** (Default)
   - For data fetching from databases
   - For accessing sensitive environment variables
   - For keeping large dependencies server-side

2. **Client Components** (Use `'use client'`)
   - For interactivity (click handlers, form submissions)
   - For using React hooks (useState, useEffect)
   - For browser APIs (localStorage, window)

   ```typescript
   // ✅ Server component (no 'use client')
   export default async function Dashboard() {
     const data = await fetchData();
     return <div>{data}</div>;
   }

   // ✅ Client component (needs interactivity)
   'use client';
   import { useState } from 'react';

   export const SearchBox = () => {
     const [query, setQuery] = useState('');
     return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
   };
   ```

## Error Handling

### Try-Catch Patterns

```typescript
// ✅ Good - Clear error handling
try {
  const data = await fetchData();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('Failed to fetch data:', message);
}

// ✅ Good - With error typing
interface ApiError {
  code: string;
  message: string;
}

try {
  // API call
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.message);
}
```

## Styling Conventions

### Tailwind CSS

1. **Class Organization**
   - Group related utilities
   - Order: layout → spacing → sizing → typography → colors → effects

   ```typescript
   // ✅ Good - Organized classes
   <div className="flex items-center gap-4 px-6 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
     Content
   </div>

   // ❌ Avoid - Random order
   <div className="text-white shadow-md px-6 rounded-lg flex items-center text-lg py-4 gap-4 font-semibold bg-blue-600">
     Content
   </div>
   ```

2. **Responsive Design**
   - Use Tailwind's mobile-first breakpoints
   - Order: base → sm → md → lg → xl → 2xl

   ```typescript
   // ✅ Good
   <div className="w-full px-4 md:px-6 lg:px-8 text-sm md:text-base lg:text-lg">
     Content
   </div>
   ```

## Comments & Documentation

### JSDoc Comments

```typescript
/**
 * Fetches user data from the API
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 * @throws Error if user not found
 */
const getUserData = async (userId: string): Promise<User> => {
  // Implementation
};

/**
 * Formats a date string to locale format
 * @example
 * formatDate('2024-01-15') // Returns "January 15, 2024"
 */
const formatDate = (dateString: string): string => {
  // Implementation
};
```

### Inline Comments

- Use sparingly, only for complex logic
- Explain "why", not "what" (code shows what)

```typescript
// ✅ Good - Explains why
// We need to debounce search to avoid excessive API calls
const debouncedSearch = debounce(search, 300);

// ❌ Avoid - Obvious from code
// Set search to empty string
setSearch('');
```

## Import/Export Conventions

```typescript
// ✅ Good - Organize imports
import React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/User';

export const Component = () => {};
export default Component;

// ❌ Avoid - Random order
import type { User } from '@/types/User';
import { Button } from '@/components/ui/Button';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
```

## Best Practices

1. **DRY (Don't Repeat Yourself)**
   - Extract common patterns into functions/components
   - Create utility functions for repeated logic

2. **SOLID Principles**
   - Single Responsibility: One purpose per component
   - Open/Closed: Open for extension, closed for modification
   - Liskov Substitution: Subclasses should be substitutable
   - Interface Segregation: Clients shouldn't depend on unused interfaces
   - Dependency Inversion: Depend on abstractions, not concretions

3. **Performance**
   - Use React.memo for expensive components
   - Implement lazy loading for code splitting
   - Optimize images with Next.js Image component
   - Memoize expensive computations with useMemo

4. **Accessibility**
   - Use semantic HTML
   - Include alt text for images
   - Use ARIA labels where necessary
   - Ensure color contrast ratios meet WCAG standards

---

See also: COMPONENT_PATTERNS.md, ARCHITECTURE.md
