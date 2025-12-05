## Tasks for Phase I - Todo In-Memory Python Console App (JSON Storage)

This document outlines the tasks for implementing Phase I of the Todo application, focusing on JSON-based persistence and integration with the `todo-task-manager` agent.

### Dependencies
User Stories will be implemented sequentially in the order listed below. Within each user story, tasks can be parallelized where marked `[P]`.

### Phase 1: Setup

- [X] T001 Create base project directories `src/`, `src/todo_app/`
- [X] T002 Create empty `src/__init__.py`
- [X] T003 Create empty `src/todo_app/__init__.py`
- [X] T004 Create empty `tasks.json` file for initial task storage

### Phase 2: Foundational Components

- [X] T005 Create `src/todo_app/task_manager.py`
- [X] T006 Implement `Task` dataclass in `src/todo_app/task_manager.py` (id, title, description, status) with JSON serialization/deserialization methods
- [X] T007 Implement `TaskManager` class in `src/todo_app/task_manager.py` with `_load_tasks()` and `_save_tasks()` methods
- [X] T008 Initialize `TaskManager` to load tasks on startup and save on modification (singleton instance)
- [X] T009 Implement `add_task(title, description)` function in `src/todo_app/task_manager.py` with title/description validation and saving
- [X] T010 Implement `get_task(task_id)` function in `src/todo_app/task_manager.py`
- [X] T011 Implement `list_tasks(status)` function in `src/todo_app/task_manager.py`
- [X] T012 Implement `update_task(task_id, title, description, status)` function in `src/todo_app/task_manager.py` with validation and saving
- [X] T013 Implement `delete_task(task_id)` function in `src/todo_app/task_manager.py` with saving
- [X] T014 Implement `mark_task_complete(task_id)` function in `src/todo_app/task_manager.py` with saving

### Phase 3: User Story 1 - Add Task [US1]

**Goal**: Users can add new todo items to the list, with persistence to `tasks.json`.

**Independent Test Criteria**:
- Can add tasks with title and optional description.
- Tasks are assigned unique IDs and default to "pending" status.
- Tasks are correctly saved to `tasks.json` and loaded on application restart.

- [X] T015 Create `src/todo_app/cli.py`
- [X] T016 [P] Implement `add` command parsing in `src/todo_app/cli.py` using `argparse`
- [X] T017 [P] Implement `add_task_command` function in `src/todo_app/cli.py` to call `task_manager.add_task`
- [X] T018 Create `src/main.py`
- [X] T019 Implement `main.py` to delegate to `cli.py`
- [ ] T020 Add unit tests for `add_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [ ] T021 Add integration tests for `add` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 4: User Story 2 - Delete Task [US2]

**Goal**: Users can remove existing tasks from the list, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can delete tasks by their unique ID.
- Attempting to delete a non-existent task displays an error.
- Deletions are correctly saved to `tasks.json`.

- [X] T022 [P] Implement `delete` command parsing in `src/todo_app/cli.py`
- [X] T023 [P] Implement `delete_task_command` function in `src/todo_app/cli.py` to call `task_manager.delete_task`
- [ ] T024 Add unit tests for `delete_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [ ] T025 Add integration tests for `delete` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 5: User Story 3 - Update Task [US3]

**Goal**: Users can modify the details of an existing task, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can update a task's title, description, and/or status by ID.
- Attempting to update a non-existent task displays an error.
- Updates are correctly saved to `tasks.json`.

- [X] T026 [P] Implement `update` command parsing in `src/todo_app/cli.py`
- [X] T027 [P] Implement `update_task_command` function in `src/todo_app/cli.py` to call `task_manager.update_task`
- [ ] T028 Add unit tests for `update_task` in `tests/test_task_manager.py`, including JSON persistence checks
- [ ] T029 Add integration tests for `update` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 6: User Story 4 - View Task List [US4]

**Goal**: Users can view all tasks currently in the list, or filter by status.

**Independent Test Criteria**:
- Displays all tasks with ID, title, and status.
- Can filter tasks to show only "pending" or "completed" tasks.
- List is presented in a clear and readable format.

- [X] T030 [P] Implement `view` command parsing in `src/todo_app/cli.py`
- [X] T031 [P] Implement `view_tasks_command` function in `src/todo_app/cli.py` to call `task_manager.list_tasks` and display output
- [ ] T032 Add unit tests for `list_tasks` in `tests/test_task_manager.py`, including filter logic
- [ ] T033 Add integration tests for `view` command in `tests/test_cli.py`

### Phase 7: User Story 5 - Mark as Complete [US5]

**Goal**: Users can toggle the completion status of a task, with changes persisted to `tasks.json`.

**Independent Test Criteria**:
- Can mark a task as "completed" by its ID.
- Attempting to mark a non-existent task displays an error.
- Status changes are correctly saved to `tasks.json`.

- [X] T034 [P] Implement `complete` command parsing in `src/todo_app/cli.py`
- [X] T035 [P] Implement `complete_task_command` function in `src/todo_app/cli.py` to call `task_manager.mark_task_complete`
- [ ] T036 Add unit tests for `mark_task_complete` in `tests/test_task_manager.py`, including JSON persistence checks
- [ ] T037 Add integration tests for `complete` command in `tests/test_cli.py`, verifying JSON persistence

### Phase 8: Polish & Cross-Cutting Concerns

- [X] T038 Update `README.md` with setup instructions and usage examples
- [X] T039 Update `CLAUDE.md` with any relevant agent-specific instructions or configuration if necessary
- [X] T040 Review overall code for clean code principles and Python best practices
- [X] T041 Ensure robust error handling for file I/O operations with `tasks.json`
