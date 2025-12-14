## Tasks for Phase I - Todo In-Memory Python Console App (JSON Storage)

This document outlines the tasks for implementing Phase I of the Todo application, focusing on JSON-based persistence and integration with the `todo-task-manager` agent.

### Phase 0: UV Virtual Environment Setup

**Goal**: Establish a proper Python development environment using UV as the package manager with isolated virtual environment.

**Independent Test Criteria**:
- UV virtual environment is created successfully
- Virtual environment is activated properly
- Dependencies from pyproject.toml are installed in the isolated environment
- Application can be run within the virtual environment
- uv.lock file is generated with locked dependency versions

- [X] T000 Install UV package manager on the system
- [X] T001 Create virtual environment using `uv venv`
- [X] T002 Activate virtual environment with proper shell-specific activation command
- [X] T003 Create `pyproject.toml` with project metadata and initial dependencies
- [X] T004 Install dependencies using `uv sync` or `uv pip install`
- [X] T005 Generate `uv.lock` file with locked dependency versions
- [X] T006 Verify virtual environment isolation by checking package list
- [X] T007 Document UV virtual environment setup process in README.md

### Phase 1: Setup

- [X] T008 Create base project directories `src/`, `src/todo_app/`
- [X] T009 Create empty `src/__init__.py`
- [X] T010 Create empty `src/todo_app/__init__.py`
- [X] T011 Create empty `tasks.json` file for initial task storage

### Phase 2: Foundational Components

- [X] T012 Create `src/todo_app/task_manager.py`
- [X] T013 Implement `Task` dataclass in `src/todo_app/task_manager.py` (id, title, description, status) with JSON serialization/deserialization methods
- [X] T014 Implement `TaskManager` class in `src/todo_app/task_manager.py` with `_load_tasks()` and `_save_tasks()` methods
- [X] T015 Initialize `TaskManager` to load tasks on startup and save on modification (singleton instance)
- [X] T016 Implement `add_task(title, description)` function in `src/todo_app/task_manager.py` with title/description validation and saving
- [X] T017 Implement `get_task(task_id)` function in `src/todo_app/task_manager.py`
- [X] T018 Implement `list_tasks(status)` function in `src/todo_app/task_manager.py`
- [X] T019 Implement `update_task(task_id, title, description, status)` function in `src/todo_app/task_manager.py` with validation and saving
- [X] T020 Implement `delete_task(task_id)` function in `src/todo_app/task_manager.py` with saving
- [X] T021 Implement `mark_task_complete(task_id)` function in `src/todo_app/task_manager.py` with saving

### Phase 3: User Story 1 - Add Task [US1]

**Goal**: Users can add new todo items to the list, with persistence to `tasks.json`.

**Independent Test Criteria**:
- Can add tasks with title and optional description.
- Tasks are assigned unique IDs and default to "pending" status.
- Tasks are correctly saved to `tasks.json` and loaded on application restart.

- [X] T022 Create `src/todo_app/cli.py`
- [X] T023 [P] Implement `add` command parsing in `src/todo_app/cli.py` using `argparse`
- [X] T024 [P] Implement `add_task_command` function in `src/todo_app/cli.py` to call `task_manager.add_task`
- [X] T025 Create `src/main.py`
- [X] T026 Implement `main.py` to delegate to `cli.py`
- [X] T027 Add unit tests for `add_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [X] T028 Add integration tests for `add` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 4: User Story 2 - Delete Task [US2]

**Goal**: Users can remove existing tasks from the list, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can delete tasks by their unique ID.
- Attempting to delete a non-existent task displays an error.
- Deletions are correctly saved to `tasks.json`.

- [X] T029 [P] Implement `delete` command parsing in `src/todo_app/cli.py`
- [X] T030 [P] Implement `delete_task_command` function in `src/todo_app/cli.py` to call `task_manager.delete_task`
- [X] T031 Add unit tests for `delete_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [X] T032 Add integration tests for `delete` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 5: User Story 3 - Update Task [US3]

**Goal**: Users can modify the details of an existing task, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can update a task's title, description, and/or status by ID.
- Attempting to update a non-existent task displays an error.
- Updates are correctly saved to `tasks.json`.

- [X] T033 [P] Implement `update` command parsing in `src/todo_app/cli.py`
- [X] T034 [P] Implement `update_task_command` function in `src/todo_app/cli.py` to call `task_manager.update_task`
- [X] T035 Add unit tests for `update_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [X] T036 Add integration tests for `update` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 6: User Story 4 - View Task List [US4]

**Goal**: Users can view all tasks currently in the list, or filter by status.

**Independent Test Criteria**:
- Displays all tasks with ID, title, and status.
- Can filter tasks to show only "pending" or "completed" tasks.
- List is presented in a clear and readable format.

- [X] T037 [P] Implement `view` command parsing in `src/todo_app/cli.py`
- [X] T038 [P] Implement `view_tasks_command` function in `src/todo_app/cli.py` to call `task_manager.list_tasks` and display output
- [X] T039 Add unit tests for `list_tasks` in `tests/test_task_manager.py`, including filter logic
- [X] T040 Add integration tests for `view` command in `tests/test_cli.py`

### Phase 7: User Story 5 - Mark as Complete [US5]

**Goal**: Users can toggle the completion status of a task, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can mark a task as "completed" by its ID.
- Attempting to mark a non-existent task displays an error.
- Status changes are correctly saved to `tasks.json`.

- [X] T041 [P] Implement `complete` command parsing in `src/todo_app/cli.py`
- [X] T042 [P] Implement `complete_task_command` function in `src/todo_app/cli.py` to call `task_manager.mark_task_complete`
- [X] T043 Add unit tests for `mark_task_complete` in `tests/test_task_manager.py`, including JSON persistence checks
- [X] T044 Add integration tests for `complete` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 8: Interactive CLI Interface Implementation

**Goal**: Implement a user-friendly, colorful, menu-driven interface with arrow key navigation while maintaining command-line support for agent integration.

**Independent Test Criteria**:
- Interactive menu is displayed with colorful UI elements when no command-line arguments are provided.
- Menu options include: "Add Task", "View Tasks", "Update Task", "Delete Task", "Mark as Complete", and "Exit".
- Menu navigation works with arrow keys and Enter key selection.
- Input prompts guide users through each operation with clear instructions.
- Both interactive and command-line modes work correctly without interfering with each other.
- Error messages are displayed in a visually distinct manner in interactive mode.

- [X] T049 Create `src/todo_app/ui.py` module for colorful UI components
- [X] T050 Implement colorful menu display function in `src/todo_app/ui.py` using Rich library
- [X] T051 Implement task list display function in `src/todo_app/ui.py` with styling and status indicators
- [X] T052 Implement input prompt functions in `src/todo_app/ui.py` for task title and description
- [X] T053 Implement error display function in `src/todo_app/ui.py` with visual distinction
- [X] T054 Update `src/todo_app/cli.py` to support interactive menu mode using inquirer
- [X] T055 Implement interactive menu flow in `src/todo_app/cli.py` with navigation between options
- [X] T056 Update `src/main.py` to detect if arguments are provided and launch appropriate mode
- [X] T057 Add rich and inquirer dependencies to `pyproject.toml`
- [X] T058 Implement "Add Task" flow in interactive mode with guided input prompts
- [X] T059 Implement "View Tasks" flow in interactive mode with colorful task display
- [X] T060 Implement "Update Task" flow in interactive mode with task selection and editing
- [X] T061 Implement "Delete Task" flow in interactive mode with task selection and confirmation
- [X] T062 Implement "Mark as Complete" flow in interactive mode with task selection
- [X] T063 Add unit tests for `ui.py` functions to verify formatting and display
- [X] T064 Add integration tests for interactive menu functionality
- [X] T065 Update `README.md` to document both interactive and command-line usage modes

### Phase 9: Polish & Cross-Cutting Concerns

- [X] T045 Update `README.md` with setup instructions and usage examples
- [X] T046 Update `CLAUDE.md` with any relevant agent-specific instructions or configuration if necessary
- [X] T047 Review overall code for clean code principles and Python best practices
- [X] T048 Ensure robust error handling for file I/O operations with `tasks.json`

