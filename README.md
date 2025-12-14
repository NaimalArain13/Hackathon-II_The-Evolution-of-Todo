# Hackathon II - The Evolution of Todo

**Mastering Spec-Driven Development & Cloud-Native AI**

This project demonstrates the evolution of a software application from a simple console app to a fully-featured, cloud-native AI chatbot deployed on Kubernetes. Built using **Spec-Driven Development** with **Claude Code** and **Spec-Kit Plus**.

## Project Overview

This is a **monorepo** containing multiple phases of the Todo application evolution:
- ✅ **Phase I**: Console App (Complete)
- 🚧 **Phase II**: Full-Stack Web Application (In Progress)
- ⏳ **Phase III**: AI Chatbot with MCP Server
- ⏳ **Phase IV**: Local Kubernetes Deployment
- ⏳ **Phase V**: Advanced Cloud Deployment

## Quick Start

### Phase 1 - Console App (Completed)
```bash
cd phase-1
uv venv
source .venv/bin/activate  # Windows: .venv/Scripts/activate
uv sync
python3 src/main.py
```

### Phase 2 - Full-Stack Web App (In Progress)

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:3000
```

#### Backend (FastAPI)
```bash
cd backend
uv venv
source .venv/bin/activate
uv sync
uvicorn main:app --reload
# Opens on http://localhost:8000
```

## Project Structure

```
Hackathon II/
├── phase-1/              # ✅ Phase I: Python Console App (Complete)
│   ├── src/              # Source code
│   ├── tests/            # Unit tests
│   └── README.md         # Phase 1 documentation
│
├── frontend/             # 🚧 Phase II: Next.js Frontend (In Progress)
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # API client and utilities
│   └── CLAUDE.md         # Frontend development guidelines
│
├── backend/              # 🚧 Phase II: FastAPI Backend (In Progress)
│   ├── routes/           # API endpoints
│   ├── models.py         # Database models
│   ├── middleware/       # Authentication middleware
│   └── CLAUDE.md         # Backend development guidelines
│
├── specs/                # Centralized Specifications
│   ├── overview.md       # Project overview
│   ├── architecture.md   # System architecture
│   ├── features/         # Feature specifications
│   ├── api/              # API specifications
│   ├── database/         # Database schemas
│   └── ui/               # UI specifications
│
├── history/              # Prompt History Records & ADRs
│   ├── prompts/          # Development history
│   └── adr/              # Architectural Decision Records
│
├── .specify/             # Spec-Kit Plus templates and scripts
│   ├── memory/
│   │   └── constitution.md  # Project principles
│   └── templates/        # Spec templates
│
├── CLAUDE.md             # Root development guidelines
└── README.md             # This file
```

## Technology Stack

### Phase I: Console App ✅
- **Language**: Python 3.13+
- **Package Manager**: UV
- **UI**: Rich (colorful CLI) + Inquirer (interactive menus)
- **Storage**: JSON file persistence

### Phase II: Full-Stack Web App 🚧
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.13+
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: Better Auth with JWT tokens
- **Deployment**: Vercel (frontend) + Hugging Face (backend)

### Phase III: AI Chatbot ⏳
- **UI**: OpenAI ChatKit
- **AI Framework**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **Database**: Neon PostgreSQL (with conversations & messages)

### Phase IV: Local Kubernetes ⏳
- **Containerization**: Docker with Docker AI (Gordon)
- **Orchestration**: Kubernetes (Minikube)
- **Package Manager**: Helm Charts
- **AIOps**: kubectl-ai, kagent

### Phase V: Cloud Deployment ⏳
- **Cloud Provider**: DigitalOcean Kubernetes (DOKS)
- **Messaging**: Kafka on Redpanda Cloud
- **Runtime**: Dapr
- **CI/CD**: GitHub Actions

## Features by Phase

### Phase I (Complete) ✅
- Add, delete, update, view, mark complete tasks
- Interactive menu with colorful UI
- Command-line interface for scripts
- JSON persistence
- Input validation

### Phase II (In Progress) 🚧
- Multi-user authentication (Better Auth + JWT)
- RESTful API with FastAPI
- Responsive web UI with Next.js
- Persistent storage in PostgreSQL
- User isolation and security

### Phase III (Planned) ⏳
- Conversational task management
- Natural language understanding
- MCP tools for task operations
- Stateless chatbot with database persistence

### Phase IV (Planned) ⏳
- Docker containerization
- Local Kubernetes deployment with Minikube
- Helm charts for package management
- AI-assisted DevOps (kubectl-ai, kagent)

### Phase V (Planned) ⏳
- Recurring tasks with automated scheduling
- Due dates and reminders
- Event-driven architecture with Kafka
- Production deployment on DigitalOcean
- Full Dapr integration (Pub/Sub, State, Bindings, Secrets)

## Development Approach

### Spec-Driven Development (Required)
This project follows **Spec-Driven Development**:
1. Write specifications in `/specs`
2. Use Claude Code to generate implementation
3. Refine specs until code is correct
4. Manual coding is not allowed per constitution

### Workflow
```
1. Write Spec → @specs/features/task-crud.md
2. Ask Claude Code → "Implement @specs/features/task-crud.md"
3. Claude Code generates code
4. Test and iterate on spec
5. Create Prompt History Record (PHR)
```

## Documentation

- **[Hackathon Guide](./Hackathon%20II%20-%20Todo%20Spec-Driven%20Development.md)**: Complete hackathon requirements
- **[Constitution](./.specify/memory/constitution.md)**: Project principles
- **[Overview](./specs/overview.md)**: Project overview and status
- **[Architecture](./specs/architecture.md)**: System architecture across phases
- **[Root CLAUDE.md](./CLAUDE.md)**: Monorepo development guidelines
- **[Frontend CLAUDE.md](./frontend/CLAUDE.md)**: Frontend-specific guidelines
- **[Backend CLAUDE.md](./backend/CLAUDE.md)**: Backend-specific guidelines
- **[Phase 1 README](./phase-1/README.md)**: Phase 1 documentation

## Setup Instructions

### Prerequisites
- **Python 3.13+** (for backend and Phase 1)
- **UV** package manager for Python
- **Node.js 18+** and npm/pnpm/yarn (for frontend)
- **Git** for version control
- **PostgreSQL** (Neon Serverless for Phase 2+)

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-shared-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-shared-secret-here
JWT_ALGORITHM=HS256
```

**Important**: `BETTER_AUTH_SECRET` must be identical in both frontend and backend.

## Testing

### Phase 1
```bash
cd phase-1
pytest tests/
```

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest tests/
```

## Deployment

### Phase 2 Deployment

#### Frontend to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Backend to Hugging Face Spaces
1. Create new Space (FastAPI template)
2. Upload backend files
3. Add secrets in Space settings
4. Deploy

## Scoring

| Phase | Points | Due Date | Status |
|-------|--------|----------|--------|
| Phase I | 100 | Dec 7, 2025 | ✅ Complete |
| Phase II | 150 | Dec 14, 2025 | 🚧 In Progress |
| Phase III | 200 | Dec 21, 2025 | ⏳ Planned |
| Phase IV | 250 | Jan 4, 2026 | ⏳ Planned |
| Phase V | 300 | Jan 18, 2026 | ⏳ Planned |
| **Total** | **1,000** | | |

### Bonus Points
- Reusable Intelligence (Subagents/Skills): +200
- Cloud-Native Blueprints: +200
- Multi-language Support (Urdu): +100
- Voice Commands: +200
- **Total Bonus**: +600

## Contributing

This is an individual hackathon project. Each participant submits separately.

## Resources

- [Claude Code Documentation](https://ai-native.panaversity.org/docs/AI-Tool-Landscape/claude-code-features-and-workflows)
- [Spec-Driven Development](https://ai-native.panaversity.org/docs/SDD-RI-Fundamentals)
- [Nine Pillars of AI-Driven Development](https://ai-native.panaversity.org/docs/Introducing-AI-Driven-Development/nine-pillars)
- [Neon Database](https://neon.tech)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)

## License

This project is part of the Panaversity, PIAIC, and GIAIC Hackathon II.

---

**Built with Claude Code + Spec-Kit Plus**
**Hackathon II - The Evolution of Todo**
**Version**: 2.0.0 | **Last Updated**: 2025-12-08
