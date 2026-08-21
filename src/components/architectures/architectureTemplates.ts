export interface ArchitectureTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  diagram: string;
  defaultContent: string;
  tags: string[];
}

export const ARCHITECTURE_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'nextjs-fullstack',
    name: 'Modern Next.js Full-Stack Web App',
    category: 'Full-Stack',
    description: 'Next.js App Router, SSR/CSR, Supabase / PostgreSQL, Redis Caching, and S3 Storage',
    tags: ['Next.js', 'React', 'PostgreSQL', 'Redis', 'TailwindCSS'],
    diagram: `graph TD
    User([🌐 End User / Browser]) -->|HTTPS / Requests| Cloudflare[Cloudflare CDN / Edge]
    Cloudflare -->|Fast Route| NextServer[Next.js 16 Server / App Router]
    
    subgraph "Frontend & Server Runtime"
        NextServer -->|Server Components & SSR| RSC[React Server Components]
        NextServer -->|API Routes / Actions| RouteHandlers[Route Handlers]
    end

    subgraph "Data & Storage Layer"
        RouteHandlers -->|ORM Queries| Prisma[Prisma ORM]
        Prisma -->|Pooled Connections| Postgres[(PostgreSQL Database)]
        RouteHandlers -->|Session / Cache| Redis[(Redis Key-Value)]
        RouteHandlers -->|Assets & Uploads| S3Bucket[(S3 Object Storage)]
    end

    subgraph "External Integrations"
        RouteHandlers -->|Auth Validation| SupabaseAuth[Supabase Auth]
        RouteHandlers -->|Async Jobs / Triggers| Webhooks[Third-party Webhooks]
    end

    classDef client fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef server fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef db fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef ext fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;

    class User client;
    class NextServer,RSC,RouteHandlers server;
    class Postgres,Redis,S3Bucket,Prisma db;
    class SupabaseAuth,Webhooks,Cloudflare ext;`,
    defaultContent: `# Modern Next.js Full-Stack Architecture

## 1. Overview
This architecture represents a production-grade full-stack web application built on **Next.js 16 (App Router)**, **PostgreSQL**, and **Redis caching**.

## 2. Key Components
- **Edge Layer (Cloudflare)**: Handles SSL termination, caching static assets, and DDoS protection.
- **Application Server (Next.js)**: Utilizes Server Components for optimal SEO and rapid initial page loads. Route handlers serve REST / Server Actions for state mutations.
- **Database & Cache**: Primary persistence with PostgreSQL using connection pooling and Prisma ORM. Redis is utilized for high-throughput session checks and cache warming.

## 3. Data Flow
1. User requests page $\\rightarrow$ Edge delivers cached HTML or triggers SSR.
2. Client fetches dynamic data $\\rightarrow$ Route Handlers check Redis cache before falling back to PostgreSQL queries.
3. Mutations invalidate relevant query tags and trigger optimistic UI updates.

## 4. Key Learnings & Improvements
- Keep server actions strictly isolated with input validation schemas (Zod).
- Use database connection pooling to handle concurrency spikes.
`,
  },
  {
    id: 'microservices',
    name: 'Microservices & Event-Driven Architecture',
    category: 'System Architecture',
    description: 'API Gateway, Auth Service, Domain Services, Kafka Message Bus, and Polyglot Databases',
    tags: ['Microservices', 'API Gateway', 'Kafka', 'Docker', 'Kubernetes'],
    diagram: `graph TD
    Client([📱 Web & Mobile Clients]) -->|REST / GraphQL| Gateway[API Gateway & Rate Limiter]
    
    subgraph "Security & Discovery"
        Gateway -->|JWT Validation| AuthService[Auth & Identity Service]
        AuthService --> AuthDB[(Auth DB)]
    end

    subgraph "Core Microservices"
        Gateway -->|gRPC / HTTP| UserService[User Profile Service]
        Gateway -->|gRPC / HTTP| OrderService[Order & Billing Service]
        Gateway -->|gRPC / HTTP| InventoryService[Inventory Service]
    end

    subgraph "Asynchronous Event Stream"
        OrderService -->|Publish 'OrderCreated'| KafkaCluster[[Apache Kafka Event Bus]]
        KafkaCluster -->|Consume Event| NotificationService[Notification Service]
        KafkaCluster -->|Consume Event| AnalyticsWorker[Analytics Pipeline]
        KafkaCluster -->|Consume Event| InventoryService
    end

    subgraph "Storage per Service"
        UserService --> UserDB[(PostgreSQL)]
        OrderService --> OrderDB[(PostgreSQL)]
        InventoryService --> InvDB[(MongoDB)]
        AnalyticsWorker --> ClickhouseDB[(ClickHouse Analytics)]
    end

    classDef gw fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;
    classDef svc fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef bus fill:#f97316,stroke:#c2410c,stroke-width:2px,color:#fff;
    classDef storage fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;

    class Gateway gw;
    class AuthService,UserService,OrderService,InventoryService,NotificationService,AnalyticsWorker svc;
    class KafkaCluster bus;
    class AuthDB,UserDB,OrderDB,InvDB,ClickhouseDB storage;`,
    defaultContent: `# Microservices & Event-Driven Architecture

## 1. System Topology
- **API Gateway**: Single ingress point handling rate limiting, request validation, and TLS termination.
- **Decoupled Services**: Each service owns its own database according to the *Database-per-Service* pattern.
- **Event Bus (Kafka)**: Enables resilient asynchronous communication across boundaries without tight RPC coupling.

## 2. Resilience Patterns
- **Circuit Breakers**: Prevent cascading failure when downstream microservices degrade.
- **Dead Letter Queues (DLQ)**: Capture malformed event messages for manual inspection and retry.
`,
  },
  {
    id: 'ai-rag-pipeline',
    name: 'AI & LLM RAG (Retrieval-Augmented) Pipeline',
    category: 'AI & Machine Learning',
    description: 'Document Chunking, Vector Embeddings, Hybrid Search (Dense + BM25), and LLM Reasoning',
    tags: ['AI', 'LLM', 'RAG', 'VectorDB', 'Embeddings', 'LangChain'],
    diagram: `flowchart LR
    DocIngest[📄 Source Documents / PDFs] --> Chunker[Semantic Chunking Engine]
    Chunker --> Embedder[Embedding Model e.g. text-embedding-3]
    Embedder --> VectorDB[(Vector DB e.g. Pinecone / pgvector)]

    UserPrompt([💬 User Query]) --> QueryEmbed[Generate Query Vector]
    QueryEmbed --> HybridSearch{Hybrid Retrieval: Vector + Keyword}
    VectorDB --> HybridSearch
    
    HybridSearch --> TopK[Top-K Ranked Context Chunks]
    TopK --> PromptBuilder[System Prompt + Context Builder]
    UserPrompt --> PromptBuilder
    
    PromptBuilder --> LLM[Large Language Model e.g. Claude / GPT / Gemini]
    LLM --> StreamResponse([⚡ Streaming Answer to User])

    classDef source fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;
    classDef ai fill:#ec4899,stroke:#be185d,stroke-width:2px,color:#fff;
    classDef vdb fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef out fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    class DocIngest,Chunker source;
    class Embedder,QueryEmbed,LLM ai;
    class VectorDB,HybridSearch,TopK vdb;
    class StreamResponse,PromptBuilder out;`,
    defaultContent: `# Retrieval-Augmented Generation (RAG) Architecture

## 1. Pipeline Stages
1. **Ingestion & Indexing**: Documents are split into semantic chunks with overlapping windows and converted into high-dimensional embeddings.
2. **Hybrid Search**: Combines cosine similarity on vectors with BM25 sparse keyword matching for superior retrieval accuracy.
3. **Synthesis & Grounding**: LLM is supplied with retrieved sources and instructed to cite exact passages.

## 2. Evaluation Metrics
- **Retrieval Precision**: Are the Top-K chunks truly relevant?
- **Faithfulness / Groundedness**: Does the LLM answer strictly from provided context without hallucinating?
`,
  },
  {
    id: 'auth-jwt-flow',
    name: 'OAuth 2.0 & JWT Authentication Flow',
    category: 'Backend & APIs',
    description: 'Access Token / Refresh Token rotation, PKCE verification, and HttpOnly Cookie security',
    tags: ['Auth', 'OAuth', 'JWT', 'Security', 'Cookies'],
    diagram: `sequenceDiagram
    autonumber
    actor User as 👤 User
    participant Client as 🖥️ Client Web App
    participant AuthAPI as 🔐 Auth Server / API
    participant DB as 🗄️ Database
    participant Protected as 🛡️ Protected API

    User->>Client: Enters credentials (Email / Password)
    Client->>AuthAPI: POST /api/auth/login
    AuthAPI->>DB: Verify bcrypt hash & user status
    DB-->>AuthAPI: User Valid
    AuthAPI->>AuthAPI: Sign Short-Lived Access Token (15m)
    AuthAPI->>AuthAPI: Generate Cryptographic Refresh Token (30d)
    AuthAPI-->>Client: Set HttpOnly Cookie (RefreshToken) + Return AccessToken (JSON)

    Note over Client,Protected: Authorized API Request
    Client->>Protected: Request with Authorization: Bearer {AccessToken}
    Protected->>Protected: Verify JWT Signature (RS256)
    Protected-->>Client: Return 200 OK + Resource Data

    Note over Client,AuthAPI: Token Refresh Cycle
    Client->>AuthAPI: POST /api/auth/refresh (Sends HttpOnly Cookie)
    AuthAPI->>DB: Check if Refresh Token is valid & not revoked
    AuthAPI->>AuthAPI: Rotate Refresh Token
    AuthAPI-->>Client: New Access Token + Rotated Refresh Cookie`,
    defaultContent: `# OAuth 2.0 & JWT Security Architecture

## 1. Security Principles
- **Access Tokens**: Short expiration (10–15 minutes) kept in memory to minimize exposure.
- **Refresh Tokens**: Stored exclusively in secure, SameSite=Strict, HttpOnly cookies with automatic rotation upon use.
- **Replay Protection**: Any reuse of an old refresh token immediately invalidates the entire token family.
`,
  },
  {
    id: 'relational-database-erd',
    name: 'Database Schema & Entity Relationship (ERD)',
    category: 'Database & Data Flow',
    description: 'Relational data model blueprint with primary/foreign keys and relationships',
    tags: ['Database', 'PostgreSQL', 'Prisma', 'ERD', 'Schema'],
    diagram: `erDiagram
    USER ||--o{ ROADMAP : creates
    USER ||--o{ ARCHITECTURE : designs
    USER ||--o{ TASK : manages
    USER ||--o{ HABIT : tracks
    
    ROADMAP ||--|{ ROADMAP_MODULE : contains
    
    USER {
        string id PK
        string email
        string fullName
        datetime createdAt
    }
    
    ARCHITECTURE {
        string id PK
        string userId FK
        string title
        string category
        string status
        text diagram
        text content
        string_array tags
        datetime updatedAt
    }

    ROADMAP {
        string id PK
        string userId FK
        string title
        string status
        string estimatedTime
    }

    ROADMAP_MODULE {
        string id PK
        string roadmapId FK
        string title
        string status
        int order
    }`,
    defaultContent: `# Database Entity Relationships

## 1. Entity Models
- **User**: Core entity linked across all application domains.
- **Architecture**: Represents high-level engineering blueprints, diagram definitions, and rich technical documentation.
- **Roadmap & Modules**: Multi-level hierarchical learning pathways.
`,
  },
  {
    id: 'blank-slate',
    name: 'Blank Architecture Canvas',
    category: 'System Architecture',
    description: 'Start from scratch with a clean, structured architecture blueprint',
    tags: ['Custom', 'Blueprint', 'Draft'],
    diagram: `graph TD
    Client([Client Application]) -->|HTTP / API| Gateway[API Gateway / Backend]
    Gateway --> ServiceA[Primary Service]
    Gateway --> ServiceB[Background Worker]
    ServiceA --> Database[(Database)]
    ServiceB --> Queue[(Message Queue)]`,
    defaultContent: `# System Architecture Blueprint

## 1. Executive Summary
Describe the primary objective, stakeholders, and business or technical context.

## 2. Core Architecture
- **Client Tier**:
- **Application Tier**:
- **Data Persistence**:

## 3. Trade-offs & Decisions
Document technical decisions (ADRs) and architectural trade-offs made.
`,
  },
];
