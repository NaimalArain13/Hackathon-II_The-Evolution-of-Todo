# Todo App System Architecture

## Architecture Evolution

This document outlines the architectural evolution of the Todo application across all 5 phases, with focus on Phase 2 implementation.

## Phase I Architecture ✅ (Completed)

### Console Application
```
┌─────────────────────────┐
│   User (Terminal)       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   CLI Interface         │
│  (main.py / cli.py)     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Task Manager          │
│  (Business Logic)       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   JSON Persistence      │
│   (tasks.json)          │
└─────────────────────────┘
```

**Key Characteristics:**
- Single-user, in-memory operation
- File-based persistence (JSON)
- Interactive menu + CLI modes
- No authentication required

---

## Phase II Architecture 🚧 (Current)

### Full-Stack Web Application with Authentication

```
┌────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Next.js 16+ Frontend (Vercel)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │  │
│  │  │  Pages/    │  │ Components │  │  API Client      │  │  │
│  │  │  Routes    │  │    (UI)    │  │  (lib/api.ts)    │  │  │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │        Better Auth (Client-side JWT)              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │ HTTPS/REST
                          │ (JWT in Authorization header)
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          FastAPI Backend (Hugging Face/Python Host)      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │            JWT Verification Middleware             │  │  │
│  │  │      (Validates tokens, extracts user_id)          │  │  │
│  │  └───────────────────┬────────────────────────────────┘  │  │
│  │                      │                                    │  │
│  │         ┌────────────┼────────────┐                      │  │
│  │         ▼            ▼            ▼                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐            │  │
│  │  │  Auth    │ │  Tasks   │ │  Other       │            │  │
│  │  │  Routes  │ │  Routes  │ │  Routes      │            │  │
│  │  └──────────┘ └──────────┘ └──────────────┘            │  │
│  │         │            │            │                      │  │
│  │         └────────────┼────────────┘                      │  │
│  │                      ▼                                    │  │
│  │            ┌──────────────────┐                          │  │
│  │            │   SQLModel ORM   │                          │  │
│  │            └─────────┬────────┘                          │  │
│  └──────────────────────┼───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Neon Serverless PostgreSQL (Cloud)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │  │
│  │  │   users    │  │   tasks    │  │   (future       │   │  │
│  │  │   table    │  │   table    │  │    tables)      │   │  │
│  │  └────────────┘  └────────────┘  └─────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Phase II Components

#### Frontend (Next.js 16+)
- **App Router**: Server and client components
- **Pages**: Login, Dashboard, Task Management
- **Components**: Task list, Task form, Navigation
- **API Client** (`lib/api.ts`): Handles all backend requests with JWT
- **Better Auth**: Client-side authentication with JWT tokens
- **Styling**: Tailwind CSS

#### Backend (FastAPI)
- **main.py**: Application entry point with CORS configuration
- **models.py**: SQLModel database models (User, Task)
- **routes/auth.py**: Authentication endpoints
- **routes/tasks.py**: Task CRUD endpoints with user isolation
- **middleware/jwt.py**: JWT verification and user extraction
- **db.py**: Database connection and session management

#### Database (Neon PostgreSQL)
- **users** table: User accounts (managed by Better Auth)
- **tasks** table: Todo items with user_id foreign key

### Authentication Flow

```
1. User Sign Up/Sign In (Frontend)
   │
   ├─> Better Auth creates session
   └─> Better Auth issues JWT token

2. Frontend stores JWT
   │
   └─> localStorage or httpOnly cookie

3. API Request (Frontend)
   │
   ├─> Attach JWT to Authorization header
   └─> Authorization: Bearer <token>

4. Backend receives request
   │
   ├─> Middleware extracts JWT
   ├─> Verifies signature with BETTER_AUTH_SECRET
   ├─> Decodes user_id from token
   ├─> Validates user_id matches URL parameter
   └─> Attaches user info to request

5. Route Handler
   │
   └─> Filters data by authenticated user_id
```

### API Endpoints (Phase II)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/signin` | Sign in existing user | No |
| POST | `/api/auth/signout` | Sign out user | Yes |
| GET | `/api/{user_id}/tasks` | List user's tasks | Yes |
| POST | `/api/{user_id}/tasks` | Create new task | Yes |
| GET | `/api/{user_id}/tasks/{id}` | Get task details | Yes |
| PUT | `/api/{user_id}/tasks/{id}` | Update task | Yes |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task | Yes |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion | Yes |

### Data Models (Phase II)

#### User Model
```python
class User(SQLModel, table=True):
    id: str = Field(primary_key=True)  # Better Auth manages this
    email: str = Field(unique=True, index=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### Task Model
```python
class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Security Architecture

#### JWT Token Flow
1. **Frontend**: Better Auth creates JWT with shared secret
2. **Backend**: FastAPI verifies JWT with same shared secret
3. **Shared Secret**: `BETTER_AUTH_SECRET` environment variable (both services)

#### Security Measures
- JWT token expiration (e.g., 7 days)
- User isolation: Each user only sees their own tasks
- SQL injection prevention via SQLModel/SQLAlchemy
- CORS configuration for frontend domain
- HTTPS in production (Vercel + backend host)

---

## Phase III Architecture ⏳ (Future)

### AI Chatbot with MCP Server

```
┌────────────────────┐     ┌──────────────────────────────────────┐
│  OpenAI ChatKit UI │────▶│         FastAPI Server               │
│   (Frontend)       │     │  ┌────────────────────────────────┐  │
└────────────────────┘     │  │     Chat Endpoint              │  │
                           │  │     POST /api/{user_id}/chat   │  │
                           │  └────────────┬───────────────────┘  │
                           │               │                       │
                           │               ▼                       │
                           │  ┌────────────────────────────────┐  │
                           │  │    OpenAI Agents SDK           │  │
                           │  │    (Agent + Runner)            │  │
                           │  └────────────┬───────────────────┘  │
                           │               │                       │
                           │               ▼                       │
                           │  ┌────────────────────────────────┐  │
                           │  │        MCP Server              │  │
                           │  │  (Official MCP SDK)            │  │
                           │  │  Tools:                        │  │
                           │  │  - add_task                    │  │
                           │  │  - list_tasks                  │  │
                           │  │  - complete_task               │  │
                           │  │  - update_task                 │  │
                           │  │  - delete_task                 │  │
                           │  └────────────┬───────────────────┘  │
                           └───────────────┼────────────────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────────┐
                           │    Neon PostgreSQL DB        │
                           │  - tasks                     │
                           │  - conversations             │
                           │  - messages                  │
                           └──────────────────────────────┘
```

**Key Features:**
- Conversational interface for task management
- Stateless server with database-persisted conversations
- MCP tools for all task operations
- Natural language understanding

---

## Phase IV Architecture ⏳ (Future)

### Local Kubernetes Deployment

```
┌────────────────────────────────────────────────────────────┐
│                    Minikube Cluster                        │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Frontend    │  │  Backend     │  │  PostgreSQL  │   │
│  │  Deployment  │  │  Deployment  │  │  StatefulSet │   │
│  │  (Next.js)   │  │  (FastAPI)   │  │              │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │            │
│  ┌──────▼─────────────────▼─────────────────▼───────┐   │
│  │              Kubernetes Services                  │   │
│  └───────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Helm Charts                           │  │
│  │  - Frontend chart                                  │  │
│  │  - Backend chart                                   │  │
│  │  - Database chart                                  │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Tools:**
- Docker AI Agent (Gordon)
- kubectl-ai for intelligent Kubernetes operations
- kagent for cluster health analysis
- Helm for package management

---

## Phase V Architecture ⏳ (Future)

### Cloud-Native Event-Driven System

```
┌──────────────────────────────────────────────────────────────┐
│                  DigitalOcean Kubernetes (DOKS)              │
│                                                              │
│  ┌────────┐  ┌────────┐  ┌─────────────────────────────┐   │
│  │Frontend│  │Backend │  │     Kafka Cluster           │   │
│  │ + Dapr │  │ + Dapr │  │  (Redpanda Cloud)           │   │
│  └────┬───┘  └───┬────┘  │  ┌──────────────────────┐   │   │
│       │          │        │  │ task-events          │   │   │
│       │          │        │  │ reminders            │   │   │
│       │          │        │  │ task-updates         │   │   │
│       │          │        │  └──────────────────────┘   │   │
│       └──────────┼────────┘                             │   │
│                  │                                      │   │
│                  ▼                                      │   │
│  ┌─────────────────────────────────────────────────┐   │   │
│  │            Microservices                        │   │   │
│  │  ┌──────────────┐  ┌────────────────────────┐  │   │   │
│  │  │ Notification │  │ Recurring Task Service │  │   │   │
│  │  │   Service    │  │                        │  │   │   │
│  │  └──────────────┘  └────────────────────────┘  │   │   │
│  └─────────────────────────────────────────────────┘   │   │
│                                                          │   │
│  ┌─────────────────────────────────────────────────┐   │   │
│  │              Dapr Components                    │   │   │
│  │  - Pub/Sub (Kafka)                              │   │   │
│  │  - State Management (PostgreSQL)                │   │   │
│  │  - Bindings (Cron)                              │   │   │
│  │  - Secrets (Kubernetes)                         │   │   │
│  └─────────────────────────────────────────────────┘   │   │
└──────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Event-driven architecture with Kafka
- Dapr for distributed application runtime
- Microservices for specialized functions
- Advanced features: recurring tasks, reminders, real-time sync

---

## Architectural Principles

### Current Phase (II) Principles
1. **Stateless Backend**: Each request is independent
2. **JWT Authentication**: Shared secret for frontend/backend
3. **User Isolation**: Database-level filtering by user_id
4. **RESTful API**: Standard HTTP methods and status codes
5. **Cloud-Ready**: Designed for Vercel (frontend) and cloud Python hosting (backend)

### Future-Ready Design
1. **Microservices Architecture**: Prepare for Phase III-V decomposition
2. **Event-Driven**: Design for Kafka integration in Phase V
3. **Container-Native**: Structure for Docker/Kubernetes deployment
4. **Observability**: Logging and monitoring hooks for production

## Technology Stack Summary

| Layer | Phase I | Phase II | Phase III | Phase IV | Phase V |
|-------|---------|----------|-----------|----------|---------|
| **Frontend** | CLI | Next.js 16+ | ChatKit | Containerized | + Dapr |
| **Backend** | Python | FastAPI | + MCP Server | Containerized | + Kafka |
| **Database** | JSON | Neon PostgreSQL | + Conversations | StatefulSet | + Events |
| **Auth** | None | Better Auth JWT | Same | Same | Same |
| **Orchestration** | - | - | - | Minikube | DOKS |
| **Messaging** | - | - | - | - | Kafka/Redpanda |
| **Runtime** | - | - | - | - | Dapr |

---

**Version**: 1.0.0 | **Last Updated**: 2025-12-08 | **Current Phase**: Phase II
