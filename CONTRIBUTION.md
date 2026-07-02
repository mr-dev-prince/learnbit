# Contributing to Learnbit

Thank you for your interest in contributing to Learnbit! We welcome contributions from the community and appreciate your efforts to make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Getting Started

1. Fork the repository on GitHub
2. Clone your forked repository locally:
   ```bash
   git clone https://github.com/your-username/learnbit.git
   cd learnbit
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/learnbit.git
   ```

## Development Setup

1. Ensure you have Node.js (v18+) and npm installed
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to see the application

### Build for Production

```bash
npm run build
npm start
```

## Making Changes

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following the [Coding Standards](#coding-standards)

3. Test your changes thoroughly

4. Format and lint your code:

   ```bash
   npm run format
   npm run lint
   npm run lint:fix
   ```

5. Commit your changes following [Commit Guidelines](#commit-guidelines)

## Commit Guidelines

We follow a simplified version of conventional commits:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process, dependencies, or tools

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

Example:

```
feat: add user authentication

Implement JWT-based user authentication with login and signup routes.
This includes password hashing and token refresh mechanisms.

Closes #123
```

## Pull Request Process

1. Update your branch with the latest upstream changes:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Push your branch to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request on GitHub with:
   - Clear title describing the changes
   - Detailed description of what changed and why
   - Reference to any related issues (e.g., "Closes #123")
   - Screenshots if applicable

4. Ensure all CI/CD checks pass

5. Wait for review and address feedback

6. Once approved, your PR will be merged!

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types
- Follow the naming convention: PascalCase for components

Example:

```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```

### Styling

- Use Tailwind CSS for styling
- Avoid inline styles
- Use consistent spacing and colors
- Create reusable component classes when needed

### File Organization

```
src/
├── app/              # Next.js app router
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── styles/          # Global styles and Tailwind config
└── api/             # API routes
```

## Testing

- Write tests for new features and bug fixes
- Use the testing framework of your choice (Jest, Vitest, etc.)
- Ensure tests pass before submitting a PR

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Questions or Need Help?

- Create an issue on GitHub for bugs or feature requests
- Check existing issues before creating a new one
- Be as descriptive as possible in your issue

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Learnbit! 🎉
