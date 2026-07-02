# Database Structure

## Database Overview

This document outlines the planned database structure for Learnbit. Specific database technology (PostgreSQL, MongoDB, etc.) will be configured based on project requirements.

## Data Models

### User Model

```typescript
interface User {
  id: string; // Primary key (UUID or auto-increment)
  email: string; // Unique
  passwordHash: string; // Hashed password
  firstName: string;
  lastName: string;
  avatar?: string; // Avatar URL
  bio?: string;
  role: 'student' | 'instructor' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Course Model

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or HTML
  instructor_id: string; // Foreign key to User
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  isPublished: boolean;
  thumbnail?: string;
  rating: number; // Average rating 0-5
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enrollment Model

```typescript
interface Enrollment {
  id: string;
  user_id: string; // Foreign key to User
  course_id: string; // Foreign key to Course
  progress: number; // Percentage 0-100
  status: 'active' | 'completed' | 'abandoned';
  enrolledAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}
```

### Lesson Model

```typescript
interface Lesson {
  id: string;
  course_id: string; // Foreign key to Course
  title: string;
  description: string;
  content: string;
  order: number; // Display order in course
  duration_minutes: number;
  videoUrl?: string;
  resources?: string[]; // Array of resource URLs
  createdAt: Date;
  updatedAt: Date;
}
```

### Quiz Model

```typescript
interface Quiz {
  id: string;
  course_id: string; // Foreign key to Course
  title: string;
  description: string;
  questions: Question[];
  passingScore: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  text: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | number;
  points: number;
}
```

### UserProgress Model

```typescript
interface UserProgress {
  id: string;
  user_id: string; // Foreign key to User
  lesson_id: string; // Foreign key to Lesson
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // In seconds
  createdAt: Date;
  updatedAt: Date;
}
```

### QuizResult Model

```typescript
interface QuizResult {
  id: string;
  user_id: string; // Foreign key to User
  quiz_id: string; // Foreign key to Quiz
  score: number;
  passed: boolean;
  answers: Answer[];
  completedAt: Date;
}

interface Answer {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  points: number;
}
```

## Database Schema (SQL Example)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  role VARCHAR(50) DEFAULT 'student',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  instructor_id UUID NOT NULL REFERENCES users(id),
  category VARCHAR(100),
  level VARCHAR(50),
  duration_hours INT,
  is_published BOOLEAN DEFAULT false,
  thumbnail VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 0,
  enrollment_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  progress INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  order INT NOT NULL,
  duration_minutes INT,
  video_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  lesson_id UUID NOT NULL REFERENCES lessons(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  time_spent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

## Relationships

```
Users
├── 1:N → Courses (as instructor)
├── 1:N → Enrollments
└── 1:N → UserProgress

Courses
├── N:1 → Users (instructor)
├── 1:N → Lessons
├── 1:N → Enrollments
└── 1:N → Quizzes

Lessons
├── N:1 → Courses
└── 1:N → UserProgress

Enrollments
├── N:1 → Users
└── N:1 → Courses

Quizzes
├── N:1 → Courses
└── 1:N → QuizResults

UserProgress
├── N:1 → Users
└── N:1 → Lessons
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
```

## Query Patterns

### Get User with Courses

```typescript
// Fetch user enrolled courses with progress
interface UserWithCourses {
  user: User;
  enrollments: Array<{
    id: string;
    course: Course;
    progress: number;
  }>;
}

const getUserCourses = async (userId: string): Promise<UserWithCourses> => {
  // Implementation depends on ORM/database
};
```

### Get Course with Lessons and Progress

```typescript
interface CourseWithProgress {
  course: Course;
  lessons: Lesson[];
  userProgress: Map<string, UserProgress>;
}

const getCourseProgress = async (courseId: string, userId: string): Promise<CourseWithProgress> => {
  // Implementation depends on ORM/database
};
```

## Migration Strategy

- Use database migration tool (e.g., Prisma, TypeORM, Alembic)
- Version control all migrations
- Test migrations in development before production
- Document breaking changes

## Backup & Recovery

- Regular database backups (frequency TBD)
- Backup storage location TBD
- Recovery procedures TBD

---

**Status**: Schema pending finalization based on feature requirements

See also: ARCHITECTURE.md, API_STRUCTURE.md
