# Phase 1: Todo In-Memory Python Console App

A command-line todo application that stores tasks in memory with JSON persistence. Features both interactive menu-driven interface and traditional command-line interface.

## About Phase 1

This is the completed Phase 1 implementation of the Hackathon II project. It demonstrates:
- All 5 Basic Level features (Add, Delete, Update, View, Mark Complete)
- Spec-driven development with Claude Code and Spec-Kit Plus
- Clean code principles and proper Python project structure
- UV virtual environment management

## Setup

1. Make sure you have Python 3.13+ and UV package manager installed
2. Navigate to the phase-1 directory:
   ```bash
   cd phase-1
   ```
3. Create a virtual environment:
   ```bash
   uv venv
   ```
4. Activate the virtual environment:
   - On Linux/Mac: `source .venv/bin/activate`
   - On Windows: `source .venv/Scripts/activate`
5. Install dependencies:
   ```bash
   uv sync
   ```

## Usage

### Interactive Mode (Recommended)
Run the application without any arguments to launch the interactive menu:
```bash
python3 src/main.py
```

This will present a colorful menu with options:
- **Add Task**: Create a new todo item with title and description
- **View Tasks**: Display all tasks or filter by status
- **Update Task**: Modify an existing task's title, description, or status
- **Delete Task**: Remove a task with confirmation
- **Mark as Complete**: Toggle task completion status
- **Exit**: Close the application

#### Interactive Mode Features:
- Colorful, formatted output using Rich library
- Arrow key navigation through the menu
- Input validation and error handling
- Confirmation prompts for destructive actions

### Command-Line Mode (For Scripts and Agent Integration)

#### Add a Task
```bash
python3 src/main.py add --title "Task title" --description "Task description (optional)"
```

#### View Tasks
```bash
python3 src/main.py view
# View only pending tasks
python3 src/main.py view --status pending
# View only completed tasks
python3 src/main.py view --status completed
```

#### Update a Task
```bash
python3 src/main.py update --id 1 --title "New title" --description "New description" --status pending
```

#### Delete a Task
```bash
python3 src/main.py delete --id 1
```

#### Mark Task as Complete
```bash
python3 src/main.py complete --id 1
```

## Features

- ✅ Add, delete, update, view, and mark tasks as complete
- ✅ Tasks are persisted in `tasks.json` file
- ✅ Two usage modes: interactive menu with colorful UI and command-line interface
- ✅ Input validation for titles (1-200 characters) and descriptions (max 1000 characters)
- ✅ Error handling for invalid task IDs
- ✅ Uses Rich library for colorful, formatted terminal output
- ✅ Uses Inquirer for interactive menu navigation with arrow keys
- ✅ Proper virtual environment management with UV

## Project Structure

```
phase-1/
├── src/
│   ├── __init__.py
│   ├── main.py             # Entry point for the console application
│   ├── todo_app/
│   │   ├── __init__.py
│   │   ├── task_manager.py # Implements the task management logic with JSON persistence
│   │   ├── cli.py          # Handles both interactive menu and command-line parsing
│   │   └── ui.py           # Handles colorful UI components and interactive menus
├── tests/                  # Unit tests
├── tasks.json              # Local JSON file for storing todo tasks (auto-created)
├── pyproject.toml          # Project dependencies and metadata
├── uv.lock                 # Locked dependency versions managed by UV
└── .venv/                  # Virtual environment created by UV (gitignored)
```

## Testing

Run the test suite:
```bash
pytest tests/
```

## Phase 1 Deliverables ✅

- [x] GitHub repository with Constitution, specs, source code, README.md, CLAUDE.md
- [x] Working console application demonstrating all Basic Level features
- [x] Add tasks with title and description
- [x] List all tasks with status indicators
- [x] Update task details
- [x] Delete tasks by ID
- [x] Mark tasks as complete/incomplete
- [x] JSON persistence for task storage
- [x] Interactive menu-driven interface
- [x] Command-line interface for agent integration

## Next Phase

Phase 2 will transform this console app into a full-stack web application with:
- Next.js 16+ frontend
- FastAPI backend
- Neon Serverless PostgreSQL database
- Better Auth with JWT authentication

See the parent directory for Phase 2 implementation.
