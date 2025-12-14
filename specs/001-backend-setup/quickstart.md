# Quickstart Guide: Phase 2 Backend Setup

**Feature**: 001-backend-setup
**Date**: 2025-12-10
**Estimated Time**: 5-10 minutes

This guide walks you through setting up the Phase 2 backend development environment from scratch.

---

## Prerequisites

Before you begin, ensure you have:

- [ ] **Python 3.13+** installed
- [ ] **UV package manager** installed
- [ ] **Git** installed
- [ ] **Neon PostgreSQL account** with database created
- [ ] **WSL2** (Windows users only)
- [ ] **Code editor** (VS Code recommended)

### Check Python Version

```bash
python3 --version
# Expected: Python 3.13.0 or higher
```

### Install UV Package Manager

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or via pip
pip install uv

# Verify installation
uv --version
```

### Create Neon Database

1. Visit [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Click "New Project"
4. Copy the connection string (looks like: `postgresql://username:password@host/database`)

---

## Step 1: Navigate to Backend Folder

```bash
cd "Hackathon II/backend"
```

**Verify you're in the right place:**
```bash
ls
# Should see: CLAUDE.md, README.md (and other files after setup)
```

---

## Step 2: Initialize UV Project

```bash
# Initialize UV project
uv init --lib

# This creates pyproject.toml
```

**Expected output:**
```
Initialized project `backend`
```

**Verify:**
```bash
ls
# Should see: pyproject.toml
```

---

## Step 3: Edit pyproject.toml

Update the generated `pyproject.toml` with proper dependencies:

```toml
[project]
name = "backend"
version = "0.1.0"
description = "Phase 2 Todo App Backend API"
requires-python = ">=3.13"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "sqlmodel>=0.0.24",
    "python-dotenv>=1.0.0",
    "psycopg2-binary>=2.9.9",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "httpx>=0.27.0",  # For TestClient
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

---

## Step 4: Create Virtual Environment

```bash
# Create virtual environment in backend folder
uv venv

# Expected output:
# Creating virtual environment at: .venv
```

**Verify:**
```bash
ls -la | grep .venv
# Should see: .venv/
```

---

## Step 5: Activate Virtual Environment

### Linux / macOS / WSL2:
```bash
source .venv/bin/activate
```

### Windows (native PowerShell - if not using WSL2):
```powershell
.venv\Scripts\Activate.ps1
```

**Verify activation:**
```bash
which python3
# Should show: .../backend/.venv/bin/python3
```

---

## Step 6: Install Dependencies

```bash
# Install all dependencies from pyproject.toml
uv sync

# This creates uv.lock file
```

**Expected output:**
```
Resolved X packages in Xms
Downloaded X packages in Xms
Installed X packages in Xms
```

**Verify:**
```bash
# Check FastAPI is installed
python3 -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"

# Check SQLModel is installed
python3 -c "import sqlmodel; print('SQLModel installed')"
```

---

## Step 7: Configure Environment Variables

### Create .env File

```bash
# Create .env file (this will NOT be committed to git)
touch .env
```

### Add Neon Database URL

Edit `.env` and add your Neon connection string:

```env
DATABASE_URL=postgresql://username:password@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Replace** the example with your actual connection string from Neon dashboard.

### Create .env.example

```bash
# Create .env.example (this WILL be committed to git)
touch .env.example
```

Edit `.env.example` with placeholders:

```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

---

## Step 8: Update .gitignore

Ensure `.gitignore` exists and includes:

```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python

# Virtual Environment
.venv/
venv/
ENV/

# Environment Variables
.env

# UV
uv.lock

# Testing
.pytest_cache/
.coverage
htmlcov/

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## Step 9: Verify Setup

### Check Dependencies

```bash
# List installed packages
uv pip list
```

**Expected packages:**
- fastapi
- uvicorn
- sqlmodel
- python-dotenv
- psycopg2-binary
- (and their dependencies)

### Check DATABASE_URL

```bash
# Load .env and check DATABASE_URL
python3 -c "from dotenv import load_dotenv; import os; load_dotenv(); print('DATABASE_URL is set:', bool(os.getenv('DATABASE_URL')))"

# Expected: DATABASE_URL is set: True
```

---

## Step 10: Test Database Connection (Optional)

Create a quick test script:

```bash
# Create test_connection.py
cat > test_connection.py << 'EOF'
from sqlmodel import create_engine
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ DATABASE_URL not set in .env file")
    exit(1)

try:
    engine = create_engine(DATABASE_URL, echo=True)
    with engine.connect() as conn:
        result = conn.execute("SELECT version();")
        version = result.fetchone()[0]
        print(f"\n✅ Database connected successfully!")
        print(f"PostgreSQL version: {version}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)
EOF

# Run the test
python3 test_connection.py

# Clean up
rm test_connection.py
```

**Expected output:**
```
✅ Database connected successfully!
PostgreSQL version: PostgreSQL 15.x ...
```

---

## Troubleshooting

### Issue: `uv: command not found`

**Solution**: UV not installed or not in PATH.

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Restart terminal or source shell config
source ~/.bashrc  # or ~/.zshrc
```

### Issue: `DATABASE_URL environment variable is not set`

**Solution**: .env file not created or not in correct location.

```bash
# Check if .env exists
ls -la .env

# If not, create it
touch .env

# Edit with your connection string
nano .env  # or code .env
```

### Issue: `psycopg2` import error on Windows

**Solution**: Use WSL2 instead of native Windows.

```bash
# Install WSL2
wsl --install

# Use Ubuntu terminal
wsl
```

### Issue: Connection timeout to Neon

**Possible causes**:
1. **Firewall**: Check corporate/home firewall settings
2. **Incorrect URL**: Verify connection string from Neon dashboard
3. **Neon maintenance**: Check [status.neon.tech](https://status.neon.tech)

### Issue: SSL/TLS error

**Solution**: Ensure `?sslmode=require` is in connection string.

```env
# Correct format:
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
                                              ^^^^^^^^^^^^^^^^
```

### Issue: Virtual environment not activating

**Solution**: Use correct activation command for your shell.

```bash
# Bash/Zsh (Linux/macOS/WSL2)
source .venv/bin/activate

# PowerShell (Windows)
.venv\Scripts\Activate.ps1

# cmd (Windows)
.venv\Scripts\activate.bat
```

---

## Next Steps

After successful setup, you're ready for implementation:

1. ✅ **Environment Setup Complete**
   - UV project initialized
   - Virtual environment created and activated
   - Dependencies installed
   - Database connection configured

2. 📝 **Next: Run `/sp.tasks`**
   - Generate implementation tasks
   - Start building the backend infrastructure

3. 🔨 **Implementation Tasks** (from /sp.tasks):
   - Create `main.py` with FastAPI app
   - Create `db.py` with database connection
   - Create `models.py` with User model
   - Write tests

---

## Quick Reference

### Common Commands

```bash
# Activate virtual environment
source .venv/bin/activate

# Install dependencies
uv sync

# Add new dependency
uv add package-name

# Run FastAPI app (after implementation)
uvicorn main:app --reload

# Run tests (after implementation)
pytest

# Deactivate virtual environment
deactivate
```

### File Checklist

After setup, you should have:

```
backend/
├── .env                 ✅ (your credentials, not in git)
├── .env.example         ✅ (template, in git)
├── .gitignore           ✅ (excludes .env, .venv)
├── .venv/               ✅ (virtual environment)
├── pyproject.toml       ✅ (dependencies)
├── uv.lock              ✅ (locked versions)
├── CLAUDE.md            ✅ (already exists)
└── README.md            ✅ (already exists)
```

---

## Success Criteria

Setup is complete when:

- [x] UV project initialized (`pyproject.toml` exists)
- [x] Virtual environment created (`.venv/` exists)
- [x] Virtual environment activated (prompt shows `(.venv)`)
- [x] Dependencies installed (`uv sync` completed)
- [x] `.env` file created with `DATABASE_URL`
- [x] `.gitignore` includes `.env` and `.venv`
- [x] Database connection test passes

**Estimated Setup Time**: 5-10 minutes
**Ready for Implementation**: ✅ Yes

---

## Getting Help

If you encounter issues not covered in troubleshooting:

1. **Check Neon Status**: [status.neon.tech](https://status.neon.tech)
2. **UV Documentation**: [docs.astral.sh/uv](https://docs.astral.sh/uv)
3. **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
4. **SQLModel Docs**: [sqlmodel.tiangolo.com](https://sqlmodel.tiangolo.com)
5. **Project README**: `backend/README.md`
6. **Backend Guidelines**: `backend/CLAUDE.md`

---

**Quickstart Version**: 1.0.0
**Last Updated**: 2025-12-10
**Status**: Ready for Use
