# API Structure

## API Overview

Learnbit uses Next.js API routes to provide a RESTful backend. All API endpoints are located in the `app/api/` directory and follow RESTful conventions.

## API Route Organization

```
app/api/
├── users/
│   ├── route.ts              # GET, POST /api/users
│   ├── [id]/
│   │   └── route.ts          # GET, PUT, DELETE /api/users/[id]
│   └── [id]/
│       └── profile/
│           └── route.ts      # GET, PUT /api/users/[id]/profile
├── auth/
│   ├── login/
│   │   └── route.ts          # POST /api/auth/login
│   ├── logout/
│   │   └── route.ts          # POST /api/auth/logout
│   └── register/
│       └── route.ts          # POST /api/auth/register
├── courses/
│   ├── route.ts              # GET, POST /api/courses
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE /api/courses/[id]
└── health/
    └── route.ts              # GET /api/health (status check)
```

## API Conventions

### HTTP Methods

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update entire resources
- **PATCH**: Partial updates
- **DELETE**: Remove resources

### Response Format

All API responses follow a consistent JSON structure:

#### Success Response (2xx)

```typescript
{
  success: true;
  data?: T;
  message?: string;
}
```

#### Error Response (4xx, 5xx)

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
```

### Status Codes

- **200**: OK - Successful GET, PUT, PATCH
- **201**: Created - Successful POST
- **204**: No Content - Successful DELETE
- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server error

## API Route Template

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Logic here
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_ERROR', message: String(error) } },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validation
    // Create logic
    return NextResponse.json({ success: true, data: {} }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_ERROR', message: String(error) } },
      { status: 400 },
    );
  }
}
```

## Dynamic Routes Template

```typescript
// app/api/resource/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Fetch logic
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } },
      { status: 404 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    // Update logic
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_ERROR', message: String(error) } },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Delete logic
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: String(error) } },
      { status: 400 },
    );
  }
}
```

## Authentication

All protected endpoints should check for authentication:

```typescript
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await isAuthenticated(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 },
    );
  }

  // Protected logic here
}
```

## Client-side API Usage

Use the fetch API or a client library to call endpoints:

```typescript
// Simple fetch
const response = await fetch('/api/users');
const data = await response.json();

// With error handling
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Planned Endpoints

Below are the main API endpoints to be implemented (update as development progresses):

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users` - List users (admin only)
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (admin only)
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course (admin only)
- `GET /api/health` - Health check

---

See also: ARCHITECTURE.md, CONVENTIONS.md
