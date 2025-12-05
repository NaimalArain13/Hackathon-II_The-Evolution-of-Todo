# Todo List Manager

A command-line todo application that stores tasks in memory with JSON persistence.

## Setup

1. Make sure you have Python 3.13+ installed
2. Clone or download this repository
3. Navigate to the project directory

## Usage

Run the application using Python:

```bash
python3 src/main.py [command] [options]
```

### Available Commands

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
- Command-line interface with intuitive commands
- Input validation for titles (1-200 characters) and descriptions (max 1000 characters)
- Error handling for invalid task IDs

## Project Structure

```
./
├── src/
│   ├── __init__.py
│   ├── main.py             # Entry point for the console application
│   ├── todo_app/
│   │   ├── __init__.py
│   │   ├── task_manager.py # Implements the task management logic with JSON persistence
│   │   └── cli.py          # Handles command-line parsing and interacts with task_manager.py
├── tasks.json              # Local JSON file for storing todo tasks
```