# Todo App - Hackathon II (Monorepo)

## Project Overview
This is a monorepo for the Hackathon II "Evolution of Todo" project, using GitHub Spec-Kit Plus for spec-driven development. The project evolves through 5 phases from a console app to a cloud-native AI chatbot.

## Current Phase: Phase II - Full-Stack Web Application
Transforming the console app into a modern multi-user web application with persistent storage.

## Monorepo Structure

```
Hackathon II/
├── .specify/             # SpecKit Plus templates and scripts
│   ├── memory/
│   │   └── constitution.md    # Project principles
│   └── templates/        # Spec templates
├── specs/                # Centralized specifications
│   ├── overview.md       # Project-wide overview
│   ├── architecture.md   # System architecture
│   ├── phase-1-in-memory-todo-console-app/  # Phase 1 specs
│   ├── features/         # Feature specifications (Phase 2+)
│   ├── api/              # API endpoint specifications
│   ├── database/         # Database schema specifications
│   └── ui/               # UI component specifications
├── history/              # Prompt History Records & ADRs
│   ├── prompts/
│   └── adr/
├── phase-1/              # ✅ Completed Phase 1 (Console App)
│   ├── src/              # Phase 1 Python source code
│   ├── tests/            # Phase 1 tests
│   ├── pyproject.toml    # Phase 1 dependencies
│   ├── uv.lock
│   └── README.md         # Phase 1 documentation
├── frontend/             # 🚧 Phase 2 Next.js Application
│   ├── CLAUDE.md         # Frontend-specific guidelines
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # API client, utils
│   ├── public/           # Static assets
│   ├── package.json
│   └── .env.local        # Frontend environment variables
├── backend/              # 🚧 Phase 2 FastAPI Application
│   ├── CLAUDE.md         # Backend-specific guidelines
│   ├── main.py           # FastAPI entry point
│   ├── models.py         # SQLModel database models
│   ├── routes/           # API route handlers
│   ├── middleware/       # JWT verification, etc.
│   ├── tests/            # Backend tests
│   ├── pyproject.toml    # Backend dependencies
│   ├── uv.lock
│   └── .env              # Backend environment variables
├── CLAUDE.md             # This file - Root guidelines
└── README.md             # Project documentation
```

---

## Claude Code Rules

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architect to build products.

### Task Context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

### Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

### Development Guidelines

#### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

#### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

#### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

#### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

#### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1. **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2. **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3. **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4. **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps.

### Default Policies (Must Follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

---

## Spec-Kit Plus Integration

### Specifications Directory Structure
All specifications are organized in the `/specs` directory:

- **`/specs/overview.md`** - Project overview and current status
- **`/specs/architecture.md`** - System architecture across all phases
- **`/specs/features/`** - What to build (user stories, acceptance criteria)
- **`/specs/api/`** - How APIs should work (endpoints, contracts)
- **`/specs/database/`** - Data models and schema definitions
- **`/specs/ui/`** - UI components and page specifications

### How to Use Specs with Claude Code

#### Reference Specifications
Use the `@` symbol to reference spec files:
```
@specs/overview.md
@specs/features/task-crud.md
@specs/api/rest-endpoints.md
@specs/database/schema.md
```

#### Example Workflows

**Implement a feature:**
```
You: @specs/features/authentication.md implement Better Auth login
```

**Implement API endpoint:**
```
You: @specs/api/rest-endpoints.md implement the GET /api/tasks endpoint
```

**Update database schema:**
```
You: @specs/database/schema.md add due_date field to tasks table
```

**Full feature across stack:**
```
You: Implement the task CRUD feature using @specs/features/task-crud.md,
     @specs/api/rest-endpoints.md, and @specs/database/schema.md
```

## Development Workflow with Claude Code

### For New Features:
1. **Write/Update Spec** → Create or modify spec in appropriate subfolder
   - Features: `specs/features/[feature-name].md`
   - API: `specs/api/[endpoint-group].md`
   - Database: `specs/database/schema.md`
   - UI: `specs/ui/[component-group].md`

2. **Ask Claude Code to Implement** → Reference the spec file(s)
   ```
   "Implement @specs/features/[feature-name].md"
   ```

3. **Claude Code Reads:**
   - Root CLAUDE.md (this file)
   - Relevant spec files (feature, API, database, UI)
   - Frontend or Backend CLAUDE.md (context-specific)

4. **Claude Code Implements:**
   - In both frontend and backend as needed
   - Following project conventions

5. **Test and Iterate:**
   - Run tests
   - Update spec if requirements change
   - Repeat until feature is complete

## Navigation Between Projects

### Frontend Development
```bash
cd frontend
# See frontend/CLAUDE.md for frontend-specific guidelines
```

### Backend Development
```bash
cd backend
# See backend/CLAUDE.md for backend-specific guidelines
```

### Phase 1 (Console App) - Archived
```bash
cd phase-1
# See phase-1/README.md for Phase 1 documentation
```

## Running the Projects

### Phase 1 (Console App)
```bash
cd phase-1
uv venv
source .venv/bin/activate  # or .venv/Scripts/activate on Windows
uv sync
python3 src/main.py
```

### Phase 2 - Frontend (Next.js)
```bash
cd frontend
npm install  # or pnpm install / yarn install
npm run dev
# Frontend runs on http://localhost:3000
```

### Phase 2 - Backend (FastAPI)
```bash
cd backend
uv venv
source .venv/bin/activate
uv sync
uvicorn main:app --reload --port 8000
# Backend runs on http://localhost:8000
```

## Phase 2 Architecture

### Tech Stack
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens (shared secret)
- **Deployment**: Frontend → Vercel, Backend → Hugging Face (or alternative)

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-shared-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-shared-secret-key-here  # Must match frontend!
JWT_ALGORITHM=HS256
```

**Important**: The `BETTER_AUTH_SECRET` must be identical in both frontend and backend for JWT token signing and verification.

## Development Principles

### From Constitution (.specify/memory/constitution.md)

#### 1. Spec-Driven Development (NON-NEGOTIABLE)
- All development MUST use Claude Code and Spec-Kit Plus
- Specifications are authoritative source
- Manual code writing is forbidden
- Refinement of specs required until Claude Code generates correct output

#### 2. Iterative Evolution
- Each phase builds upon the previous
- Design decisions consider future phase compatibility
- Maintain backwards compatibility where possible

#### 3. Clean Code & Structure
- Follow language/framework best practices
- Maintain proper project structure
- Write testable, maintainable code

#### 4. Comprehensive Testing
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows

#### 5. Documentation & Knowledge Capture
- Maintain comprehensive specs
- Create Prompt History Records (PHRs)
- Document architectural decisions (ADRs)

#### 6. Cloud-Native & Event-Driven Design
- Design for statelessness
- Prepare for containerization (Phase IV)
- Design for event-driven architecture (Phase V)

## Key Conventions

### Frontend Conventions (see frontend/CLAUDE.md)
- Use Next.js App Router (server components by default)
- Client components only when needed (interactivity, hooks)
- All API calls through `/lib/api.ts` client
- Tailwind CSS for styling (no inline styles)
- TypeScript for type safety

### Backend Conventions (see backend/CLAUDE.md)
- FastAPI application structure
- SQLModel for database operations
- Pydantic models for request/response
- All routes under `/api/` prefix
- JWT middleware for authentication
- HTTPException for error handling

## Claude Code Integration

### CLAUDE.md Files
- **Root CLAUDE.md** (this file): Project overview, monorepo navigation, Spec-Kit usage
- **frontend/CLAUDE.md**: Frontend-specific patterns, stack, and guidelines
- **backend/CLAUDE.md**: Backend-specific patterns, stack, and guidelines

### Referencing Files
When working with Claude Code, reference:
- Root for project context: `@CLAUDE.md`
- Frontend context: `@frontend/CLAUDE.md`
- Backend context: `@backend/CLAUDE.md`
- Constitution: `@.specify/memory/constitution.md`
- Specs: `@specs/[category]/[file].md`

## Bonus Point Consideration

For every feature implementation, always remember to check the bonus point criteria as outlined in "Hackathon II - Todo Spec-Driven Development.md":
- **Reusable Intelligence**: Can this use Claude Code Subagents or Agent Skills? (+200 points)
- **Cloud-Native Blueprints**: Can this leverage deployment blueprints? (+200 points)
- **Multi-language Support**: Add Urdu support (+100 points)
- **Voice Commands**: Implement voice input (+200 points)

If a feature can benefit from skills or subagents, suggest it.

### Integration with Agent System
This project is designed to work with Claude Code's `todo-task-manager` subagent and associated skills:
- `add-todo-task`: Create and add a new todo task
- `view-todo-tasks`: Retrieve and display tasks
- `update-todo-task`: Modify an existing task
- `delete-todo-task`: Remove a task
- `mark-todo-complete`: Change completion status

## Resources

- **Hackathon Guide**: `Hackathon II - Todo Spec-Driven Development.md`
- **Constitution**: `.specify/memory/constitution.md`
- **Specs**: `specs/` directory
- **Phase 1 Implementation**: `phase-1/` (completed, archived)
- **Architecture**: `specs/architecture.md`
- **Overview**: `specs/overview.md`

## Phase Status

| Phase | Status | Location |
|-------|--------|----------|
| Phase I: Console App | ✅ Completed | `phase-1/` |
| Phase II: Full-Stack Web App | 🚧 In Progress | `frontend/`, `backend/` |
| Phase III: AI Chatbot | ⏳ Planned | TBD |
| Phase IV: Kubernetes (Local) | ⏳ Planned | TBD |
| Phase V: Cloud Deployment | ⏳ Planned | TBD |

---

**Remember**: This is a spec-driven project. Always start with the spec, implement with Claude Code, and iterate until correct. The monorepo structure allows seamless development across the full stack while maintaining clear separation of concerns.

**Version**: 2.0.0 | **Last Updated**: 2025-12-08 | **Monorepo Structure**: Active
