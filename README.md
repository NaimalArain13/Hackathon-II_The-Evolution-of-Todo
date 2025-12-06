# Todo List Manager

A command-line todo application that stores tasks in memory with JSON persistence. Features both interactive menu-driven interface and traditional command-line interface.

## Setup with UV Virtual Environment

1. Make sure you have Python 3.13+ and UV package manager installed
2. Clone or download this repository
3. Navigate to the project directory
4. Create a virtual environment:
   ```bash
   uv venv
   ```
5. Activate the virtual environment:
   - On Linux/Mac: `source .venv/bin/activate`
   - On Windows: `source .venv/Scripts/activate`
6. Install dependencies:
   ```bash
   uv sync
   # Or: uv pip install -r requirements.txt (if you have a requirements.txt)
   # Or: python -m pip install -e . (to install the package in development mode)
   ```
7. The `uv.lock` file ensures consistent dependency versions across environments

## Usage

### Interactive Mode (Recommended for Users)
Run the application without any arguments to launch the interactive menu:
```bash
python3 src/main.py
```

This will present a colorful menu with options:
- Add Task: Create a new todo item with title and description
- View Tasks: Display all tasks or filter by status
- Update Task: Modify an existing task's title, description, or status
- Delete Task: Remove a task with confirmation
- Mark as Complete: Toggle task completion status
- Exit: Close the application

#### How to Test the Interactive Mode:
1. **Launch Interactive Mode**: Run `python3 src/main.py` (no arguments)
2. **Add Tasks**: Select "Add Task" and enter title and description
3. **View Tasks**: Select "View Tasks" to see all tasks
4. **Update Tasks**: Select "Update Task", enter task ID, and modify details
5. **Mark Complete**: Select "Mark as Complete", enter task ID to toggle status
6. **Delete Tasks**: Select "Delete Task", enter task ID, confirm deletion
7. **Exit**: Select "Exit" to close the application

The interactive mode features:
- Colorful, formatted output using Rich library
- Arrow key navigation through the menu
- Input validation and error handling
- Confirmation prompts for destructive actions

### Command-Line Mode (For Scripts and Agent Integration)
Run the application with specific commands:

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

- Add, delete, update, view, and mark tasks as complete
- Tasks are persisted in `tasks.json` file
- Two usage modes: interactive menu with colorful UI and command-line interface
- Input validation for titles (1-200 characters) and descriptions (max 1000 characters)
- Error handling for invalid task IDs
- Uses Rich library for colorful, formatted terminal output
- Uses Inquirer for interactive menu navigation with arrow keys
- Proper virtual environment management with UV

## Project Structure

```
./
├── src/
│   ├── __init__.py
│   ├── main.py             # Entry point for the console application
│   ├── todo_app/
│   │   ├── __init__.py
│   │   ├── task_manager.py # Implements the task management logic with JSON persistence
│   │   ├── cli.py          # Handles both interactive menu and command-line parsing
│   │   └── ui.py           # Handles colorful UI components and interactive menus
├── tasks.json              # Local JSON file for storing todo tasks
├── pyproject.toml          # Project dependencies and metadata
├── uv.lock                 # Locked dependency versions managed by UV
└── .venv/                  # Virtual environment created by UV (gitignored)
```