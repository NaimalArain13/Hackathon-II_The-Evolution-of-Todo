<!--
Sync Impact Report:
Version change: None -> 1.0.0
Modified principles: All (initial creation)
Added sections: Development Guidelines, Project Phases & Deliverables
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md ⚠ pending
- .specify/templates/spec-template.md ⚠ pending
- .specify/templates/tasks-template.md ⚠ pending
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->
# Hackathon II - Todo App: The Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development, across all phases, MUST adhere to Spec-Driven Development using Claude Code and Spec-Kit Plus. Specifications (Constitution, Feature Spec, Plan, Tasks) are the authoritative source for implementation. Manual code writing is forbidden; refinement of the Spec is required until Claude Code generates correct output.

### II. Iterative Evolution & AI-Native Architecture
The project will evolve through 5 distinct phases, starting from a console app to a cloud-native AI chatbot. Each phase builds upon the previous, integrating AI agents, cloud-native technologies, and event-driven architecture. Design decisions MUST consider future phase compatibility and scalability.

### III. Clean Code & Python Project Structure (Phase I Focus)
For Phase I (In-Memory Python Console App), code MUST adhere to clean code principles and proper Python project structure. This foundation will ensure maintainability and ease of transition to later phases.

### IV. Comprehensive Testing
Each feature implemented MUST be thoroughly tested. For Phase I, this means ensuring all basic CRUD operations function correctly and handle edge cases. In later phases, this will extend to integration, API, and end-to-end testing.

### V. Documentation & Knowledge Capture
Comprehensive documentation, including the Constitution, feature specifications, README.md, and CLAUDE.md files at root and sub-project levels, MUST be maintained. Prompt History Records (PHRs) MUST be created for every user prompt to capture knowledge and ensure traceability.

### VI. Cloud-Native & Event-Driven Design (Future Phase Consideration)
Although primarily for later phases, architectural decisions SHOULD pave the way for cloud-native deployment (Docker, Kubernetes) and event-driven architecture (Kafka, Dapr). This includes considering statelessness, microservices, and decoupled components from early stages.

## Development Guidelines

This project utilizes a monorepo organization with GitHub Spec-Kit + Claude Code.

### Spec-Kit Monorepo Folder Structure:
- `hackathon-todo/`
  - `.spec-kit/`: Spec-Kit configuration
  - `specs/`: Spec-Kit managed specifications (overview, architecture, features, api, database, ui)
  - `CLAUDE.md`: Root Claude Code instructions
  - `frontend/`: Next.js app (with `frontend/CLAUDE.md`)
  - `backend/`: FastAPI app (with `backend/CLAUDE.md`)
  - `docker-compose.yml`
  - `README.md`

### Workflow with Spec-Kit + Claude Code:
1. Write/Update Spec: `@specs/features/new-feature.md`
2. Ask Claude Code to Implement: "Implement `@specs/features/new-feature.md`"
3. Claude Code reads: Root CLAUDE.md, Feature spec, API spec, Database spec, Relevant CLAUDE.md
4. Claude Code implements in both frontend and backend
5. Test and iterate on spec if needed

### Layered CLAUDE.md Files:
- **Root CLAUDE.md:** Provides project overview and Spec-Kit structure.
- **Frontend CLAUDE.md:** Defines frontend stack (Next.js 14, TypeScript, Tailwind CSS), patterns (server components by default, client components only when needed), component structure, API client usage, and styling guidelines.
- **Backend CLAUDE.md:** Defines backend stack (FastAPI, SQLModel, Neon PostgreSQL), project structure, API conventions, database usage, and running instructions.

## Project Phases & Deliverables

The project will be completed in 5 phases, progressively building a Todo application from a console app to a cloud-native AI chatbot.

### Phase I: Todo In-Memory Python Console App
- **Objective:** Build a command-line todo application that stores tasks in memory.
- **Requirements:** Implement Add, Delete, Update, View, Mark Complete features; use spec-driven development; follow clean code and proper Python project structure.
- **Technology Stack:** UV, Python 3.13+, Claude Code, GitHub Spec-Kit.
- **Deliverables:** GitHub repository with Constitution, specs history, `/src` folder with Python code, `README.md`, `CLAUDE.md`; working console application demonstrating all features.

### Phase II: Todo Full-Stack Web Application
- **Objective:** Transform the console app into a modern multi-user web application with persistent storage.
- **Technology Stack:** Next.js 16+, FastAPI, SQLModel, Neon Serverless PostgreSQL, Better Auth (JWT).

### Phase III: Todo AI Chatbot
- **Objective:** Create an AI-powered chatbot interface for managing todos through natural language using MCP server architecture.
- **Technology Stack:** OpenAI ChatKit, OpenAI Agents SDK, Official MCP SDK.

### Phase IV: Local Kubernetes Deployment
- **Objective:** Deploy the Todo Chatbot on a local Kubernetes cluster using Minikube, Helm Charts.
- **Technology Stack:** Docker, Minikube, Helm, kubectl-ai, Kagent, Docker AI Agent (Gordon).

### Phase V: Advanced Cloud Deployment
- **Objective:** Implement advanced features and deploy to production-grade Kubernetes on DigitalOcean and Kafka on Redpanda Cloud.
- **Technology Stack:** Kafka, Dapr, DigitalOcean Kubernetes (DOKS), Redpanda Cloud.

## Governance
This Constitution supersedes all other project practices and documentation. Amendments to this Constitution MUST be documented, approved by project architects, and include a clear migration plan for affected systems and codebases. All Pull Requests and code reviews MUST verify compliance with the principles and guidelines outlined herein. Any architectural or design complexity MUST be justified and documented, prioritizing simplicity and the smallest viable change where possible.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04