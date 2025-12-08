# Todo App - Hackathon II Overview

## Purpose
A todo application that evolves from console app to AI chatbot through 5 progressive phases, demonstrating mastery of Spec-Driven Development and Cloud-Native AI technologies.

## Project Vision
Master the **Architecture of Intelligence** by building applications iteratively using AI-native and spec-driven approaches. This project simulates real-world evolution of software from a simple script to a Kubernetes-managed, event-driven, AI-powered distributed system.

## Current Phase
**Phase 2: Full-Stack Web Application** - Transforming the console app into a modern multi-user web application with persistent storage.

## Completed Phases

### ✅ Phase I: In-Memory Python Console App
- Command-line todo application with JSON persistence
- All 5 Basic Level features implemented (Add, Delete, Update, View, Mark Complete)
- Interactive menu-driven interface + traditional CLI
- Spec-driven development with Claude Code and Spec-Kit Plus
- **Status**: Completed and archived in `phase-1/` folder

## Current Phase: Phase II - Full-Stack Web Application

### Objective
Transform the console app into a modern multi-user web application with persistent storage.

### Tech Stack
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens
- **Development**: Claude Code + Spec-Kit Plus

### Features to Implement
- All 5 Basic Level features as a web application
- RESTful API endpoints
- Responsive frontend interface
- Multi-user support with authentication
- Persistent storage in Neon PostgreSQL database

### Deployment Targets
- **Frontend**: Vercel
- **Backend**: Hugging Face Spaces (or alternative Python hosting)

## Upcoming Phases

### Phase III: AI Chatbot (Due: Dec 21, 2025)
- Conversational interface using OpenAI ChatKit
- MCP server architecture with Official MCP SDK
- Natural language task management
- Stateless chat endpoint with database persistence

### Phase IV: Local Kubernetes Deployment (Due: Jan 4, 2026)
- Docker containerization with Docker AI Agent (Gordon)
- Helm charts for deployment
- Local deployment on Minikube
- AI-assisted operations with kubectl-ai and kagent

### Phase V: Advanced Cloud Deployment (Due: Jan 18, 2026)
- Advanced features (Recurring Tasks, Due Dates & Reminders)
- Event-driven architecture with Kafka (Redpanda Cloud)
- Dapr for distributed application runtime
- Production deployment on DigitalOcean Kubernetes (DOKS)
- CI/CD pipeline with GitHub Actions

## Project Structure

```
Hackathon II/
├── phase-1/              # ✅ Completed Phase 1 (Console App)
├── frontend/             # 🚧 Phase 2 Next.js Application
├── backend/              # 🚧 Phase 2 FastAPI Application
├── specs/                # 📋 Centralized Specifications
│   ├── features/         # Feature specifications
│   ├── api/              # API specifications
│   ├── database/         # Database schemas
│   └── ui/               # UI component specs
├── history/              # Prompt History Records & ADRs
└── .specify/             # SpecKit templates and scripts
```

## Development Principles

### Spec-Driven Development (NON-NEGOTIABLE)
- All development must use Claude Code and Spec-Kit Plus
- Specifications are authoritative source for implementation
- Manual code writing is forbidden
- Refinement of specs required until Claude Code generates correct output

### Key Principles
1. **Iterative Evolution**: Each phase builds upon the previous
2. **Clean Code**: Maintainable, well-structured code
3. **Comprehensive Testing**: Thorough testing at all levels
4. **Documentation**: Complete specs, README, and CLAUDE.md files
5. **Cloud-Native Design**: Prepare for containerization and orchestration
6. **Event-Driven Architecture**: Design for scalability and decoupling

## Success Metrics

| Phase | Points | Status |
|-------|--------|--------|
| Phase I | 100 | ✅ Completed |
| Phase II | 150 | 🚧 In Progress |
| Phase III | 200 | ⏳ Pending |
| Phase IV | 250 | ⏳ Pending |
| Phase V | 300 | ⏳ Pending |
| **Total** | **1,000** | |

### Bonus Points
- Reusable Intelligence (Subagents/Skills): +200
- Cloud-Native Blueprints: +200
- Multi-language Support (Urdu): +100
- Voice Commands: +200
- **Total Bonus**: **+600**

## Documentation

- **Constitution**: `.specify/memory/constitution.md`
- **Phase 1 Specs**: `specs/phase-1-in-memory-todo-console-app/`
- **Phase 2 Specs**: `specs/features/`, `specs/api/`, `specs/database/`, `specs/ui/`
- **Architecture**: `specs/architecture.md`
- **Prompt History**: `history/prompts/`
- **ADRs**: `history/adr/`

## Resources

- [Hackathon Guide](./Hackathon II - Todo Spec-Driven Development.md)
- [Constitution](./.specify/memory/constitution.md)
- [Phase 1 Implementation](./phase-1/)
- [Claude Code Documentation](https://ai-native.panaversity.org/docs/AI-Tool-Landscape/claude-code-features-and-workflows)
- [Spec-Driven Development](https://ai-native.panaversity.org/docs/SDD-RI-Fundamentals)

---

**Version**: 1.1.0 | **Last Updated**: 2025-12-08 | **Current Phase**: Phase II
