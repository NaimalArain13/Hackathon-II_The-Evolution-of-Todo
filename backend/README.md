# Backend - Todo App API

**Phase 2 Backend**: FastAPI application with SQLModel ORM and Neon PostgreSQL

## Quick Start

For detailed setup instructions, see: [specs/001-backend-setup/quickstart.md](../specs/001-backend-setup/quickstart.md)

### Prerequisites

- Python 3.13 or higher
- UV package manager installed
- Neon PostgreSQL account with database created
- Git

### Setup Steps

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   uv venv
   ```

3. **Activate virtual environment**
   ```bash
   # Linux/macOS/WSL2
   source .venv/bin/activate

   # Windows PowerShell (if not using WSL2)
   .venv\Scripts\Activate.ps1
   ```

4. **Install dependencies**
   ```bash
   uv sync
   ```

5. **Configure environment variables**
   ```bash
   # Create .env file from template
   cp .env.example .env

   # Edit .env and add your Neon DATABASE_URL
   # Get connection string from: https://console.neon.tech
   ```

6. **Run the application**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

7. **Verify**
   - API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/

## Tech Stack

- **Framework**: FastAPI 0.115+
- **ORM**: SQLModel 0.0.24+
- **Database**: Neon Serverless PostgreSQL
- **Server**: Uvicorn (ASGI)
- **Testing**: pytest, httpx
- **Environment**: python-dotenv

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── db.py                # Database connection and session management
├── models.py            # SQLModel database models
├── routes/              # API route handlers
│   ├── __init__.py
│   ├── auth.py          # Authentication endpoints (future)
│   └── tasks.py         # Task CRUD endpoints (future)
├── middleware/          # Custom middleware
│   ├── __init__.py
│   └── jwt.py           # JWT verification (future)
├── tests/               # Test files
│   ├── __init__.py
│   ├── conftest.py      # Pytest fixtures
│   ├── test_db.py       # Database tests
│   └── test_routes.py   # API endpoint tests
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment file
├── .gitignore           # Git ignore configuration
├── pyproject.toml       # Project metadata and dependencies
├── uv.lock              # Locked dependencies (auto-generated)
├── CLAUDE.md            # Backend-specific guidelines
└── README.md            # This file
```

## Dependencies

### Core Dependencies
- `fastapi>=0.115.0` - Modern web framework
- `uvicorn[standard]>=0.30.0` - ASGI server
- `sqlmodel>=0.0.24` - ORM (SQLAlchemy + Pydantic)
- `python-dotenv>=1.0.0` - Environment variable management
- `psycopg2-binary>=2.9.9` - PostgreSQL adapter

### Development Dependencies
- `pytest>=8.0.0` - Testing framework
- `pytest-cov>=4.1.0` - Coverage reporting
- `httpx>=0.27.0` - HTTP client for TestClient

## Common Commands

```bash
# Activate virtual environment
source .venv/bin/activate

# Install dependencies
uv sync

# Add new dependency
uv add package-name

# Run FastAPI application
uvicorn main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=. --cov-report=html

# Deactivate virtual environment
deactivate
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL`: Neon PostgreSQL connection string (required)
  - Format: `postgresql://user:password@host:port/database?sslmode=require`
  - Get from: [Neon Console](https://console.neon.tech)

Optional environment variables:
- `DB_ECHO`: Enable SQL query logging (`true`/`false`, default: `false`)
- `DB_POOL_SIZE`: Connection pool size (default: `5`)
- `DB_MAX_OVERFLOW`: Additional connections (default: `10`)

## Development Guidelines

See [backend/CLAUDE.md](./CLAUDE.md) for detailed development guidelines and conventions.

### Key Conventions
- All API routes under `/api/` prefix
- Use SQLModel for database operations
- Session management via dependency injection
- Pydantic models for request/response
- HTTPException for error handling

## Testing

Run tests with:
```bash
pytest
```

Tests use in-memory SQLite for fast, isolated testing. No Neon connection required.

## Deployment

This backend is designed for deployment to:
- Hugging Face Spaces (recommended for Phase 2)
- Railway
- Render
- Fly.io
- Any Python hosting platform

## Troubleshooting

### Issue: `uv: command not found`
Install UV:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Issue: `DATABASE_URL environment variable is not set`
Create `.env` file with your Neon connection string:
```bash
cp .env.example .env
# Edit .env with your actual DATABASE_URL
```

### Issue: Connection timeout to Neon
1. Check firewall settings
2. Verify connection string from Neon dashboard
3. Ensure `?sslmode=require` is in connection string
4. Check Neon status: https://status.neon.tech

### Issue: Virtual environment not activating
Use correct command for your shell:
```bash
# Bash/Zsh (Linux/macOS/WSL2)
source .venv/bin/activate

# PowerShell (Windows)
.venv\Scripts\Activate.ps1

# cmd (Windows)
.venv\Scripts\activate.bat
```

## Documentation

- **Feature Spec**: [specs/001-backend-setup/spec.md](../specs/001-backend-setup/spec.md)
- **Implementation Plan**: [specs/001-backend-setup/plan.md](../specs/001-backend-setup/plan.md)
- **Quickstart Guide**: [specs/001-backend-setup/quickstart.md](../specs/001-backend-setup/quickstart.md)
- **Architecture**: [specs/architecture.md](../specs/architecture.md)
- **Backend Guidelines**: [backend/CLAUDE.md](./CLAUDE.md)

## Next Steps

After backend setup:
1. Feature 002: Authentication (JWT, Better Auth)
2. Feature 003: Task API Endpoints (CRUD operations)
3. Frontend integration
4. Deployment to Hugging Face Spaces

## Version

**Version**: 0.1.0
**Last Updated**: 2025-12-10
**Status**: Initial Setup Complete
