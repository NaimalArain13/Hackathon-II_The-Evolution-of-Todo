---
id: 0003
title: Monorepo Restructuring for Phase 2 Preparation
stage: general
date: 2025-12-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: project-folder-structure-setup
user: naimalarain
command: restructure-monorepo
labels: ["architecture", "monorepo", "phase-transition", "folder-structure"]
links:
  spec: null
  ticket: null
  adr: history/adr/001-transition-from-cli-to-web-gui.md
  pr: null
files:
  - phase-1/README.md
  - phase-1/src/ (moved from root)
  - phase-1/tests/ (moved from root)
  - phase-1/pyproject.toml (moved from root)
  - phase-1/uv.lock (moved from root)
  - frontend/CLAUDE.md
  - backend/CLAUDE.md
  - backend/routes/ (created)
  - backend/middleware/ (created)
  - backend/tests/ (created)
  - specs/overview.md
  - specs/architecture.md
  - specs/features/ (created)
  - specs/api/ (created)
  - specs/database/ (created)
  - specs/ui/ (created)
  - CLAUDE.md (updated)
  - README.md (updated)
  - .gitignore (updated)
  - history/adr/001-transition-from-cli-to-web-gui.md
tests:
  - phase-1/tests/ (verified working after migration)
  - Manual test: phase-1 CLI app add/view commands
---

## Prompt

read the constitution and @"Hackathon II - Todo Spec-Driven Development.md" I have done phase 1 currently and now i want to start phase 2 but i have done all thing on root so this makes me difficult to start phase 2 because phase 2 has nextjs based frontend and fastapi based backend so there is package manager conflict if i start working on the current structure. I want to manage it like we have frontend folder seperate, backend folder seperate in which we have nextjs  in frontend folder only so that we can deploy it on vercel and backend folder has all fastapi, database, sqlmodel things which we will later deploy on hugging face. In phase 2 there is a requirment for authentication using betterAuth (same jwt token for frontend and backend to authenticate user). Read this information in @"Hackathon II - Todo Spec-Driven Development.md" Phase 2 part.  If you want to suggest me something about maintaining folder strcutre for both backend and frontend so suggestions are welcome.

sure move a head. but make sure that phase 1 preserved and worked as expected.

Why you created folder inside @frontend/ directory when we install nextjs latest version  project through a command it will automatically created boilerplate files and folders we do not need to add them manually. delete them all just intake CLAUDE.md file. all delete rest of the folder inside frontend folder. second thing i have tested phase 1 and it works absolutely fine. after deleteing the folder inside frontend folder. Please create and ADR because now we are moving from CLI to GUI and it is a complete Architectural level swtich so we have to record it as an history. one more thing create a PHR as well of our recent conversation. We need to update @frontend/CLAUDE.md  file as well because we will create a singleton api service where constants/endpoints.ts file have all endpoints and service/api.ts has all GET, POST, PUT, DELETE services using axios. we will update this specification later when start working on phase 2. I will provide you the example for singleton service

## Response snapshot

Successfully restructured the project into a monorepo with separate folders for Phase 1 (preserved), frontend, and backend. Key accomplishments:

### 1. Monorepo Structure Created
- Moved Phase 1 files to `phase-1/` folder (src, tests, pyproject.toml, uv.lock)
- Created `frontend/` folder (initially with boilerplate, later cleaned to only CLAUDE.md)
- Created `backend/` folder with routes/, middleware/, tests/ subdirectories
- Reorganized `specs/` with new subdirectories: features/, api/, database/, ui/

### 2. Phase 1 Preservation and Verification
- Created dedicated virtual environment for phase-1
- Tested Phase 1 CLI app: add and view commands work correctly
- Created Phase 1-specific README.md
- Created git tag: `phase-1-complete-backup`

### 3. Comprehensive Documentation
- Created `specs/overview.md` - Complete project overview across all phases
- Created `specs/architecture.md` - Detailed architecture documentation for Phases I-V
- Updated root `CLAUDE.md` with monorepo guidelines and Spec-Kit Plus integration
- Created `frontend/CLAUDE.md` with Next.js patterns and guidelines
- Created `backend/CLAUDE.md` with FastAPI patterns and guidelines
- Updated root `README.md` with Phase 2 information

### 4. Frontend Cleanup
- Initially created boilerplate folders (app/, components/, lib/, public/)
- Cleaned up per user feedback - deleted all folders except CLAUDE.md
- Rationale: Next.js installation will auto-create boilerplate

### 5. Architecture Decision Record (ADR)
- Created `history/adr/001-transition-from-cli-to-web-gui.md`
- Documented CLI → GUI architectural transition
- Included rationale, alternatives considered, consequences, implementation plan
- Covered technology choices: Next.js, FastAPI, Neon PostgreSQL, Better Auth

### 6. Updated .gitignore
- Added patterns for Node.js/Next.js (frontend)
- Added patterns for Python/FastAPI (backend)
- Comprehensive coverage for both stacks

### Key Design Decisions Documented

**Separation Strategy:**
- Phase 1 in `phase-1/` (Python console app)
- Frontend in `frontend/` (Next.js 16+ with npm)
- Backend in `backend/` (FastAPI with uv)
- No package manager conflicts

**Authentication Architecture:**
- Better Auth with JWT tokens
- Shared `BETTER_AUTH_SECRET` between frontend and backend
- Frontend issues tokens, backend verifies with same secret

**Deployment Plan:**
- Frontend → Vercel
- Backend → Hugging Face Spaces

**Singleton API Service Pattern (Frontend):**
- `constants/endpoints.ts` - All API endpoint URLs
- `services/api.ts` - HTTP client with axios (GET, POST, PUT, DELETE)
- Will be implemented when Phase 2 work begins

## Outcome

- ✅ Impact: Successfully restructured monorepo without breaking Phase 1; ready for Phase 2 development
- 🧪 Tests: Phase 1 tests verified working after migration
- 📁 Files: 20+ files created/modified (documented above)
- 🔁 Next prompts: Initialize Next.js project in frontend/, initialize FastAPI project in backend/, create Phase 2 specifications
- 🧠 Reflection: Clean separation achieved; Phase 1 preserved and functional; comprehensive documentation and ADR created; monorepo structure supports all 5 phases

## Evaluation notes (flywheel)

- Failure modes observed: Initially created unnecessary boilerplate folders in frontend/ that Next.js would auto-create
- Graders run and results (PASS/FAIL): Manual testing of Phase 1 CLI - PASS (add/view commands work correctly)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Initialize Next.js 16+ in frontend/ folder and verify no conflicts with monorepo structure
