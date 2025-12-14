## Plan for Phase I - Todo In-Memory Python Console App with Interactive CLI

## 1. Project Structure

The project will follow a standard Python project structure within the `/src` directory. Tasks will be stored in a `tasks.json` file at the root of the project. The application will support both interactive mode (for users) and command-line mode (for agent integration). The project will use UV as the package manager with proper virtual environment management.

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
├── tasks.json          # Local JSON file for storing todo tasks
├── pyproject.toml      # Project dependencies including rich and inquirer
├── uv.lock             # Locked dependency versions managed by UV
└── .venv/              # Virtual environment created by UV (gitignored)
```

## 2. UV Virtual Environment Management

The project will use UV as the primary package manager with the following setup and management workflow:

- **Virtual Environment Creation**: Use `uv venv` to create an isolated Python environment
- **Virtual Environment Activation**: Use `source .venv/bin/activate` (Linux/Mac) or `source .venv/Scripts/activate` (Windows) to activate the environment
- **Dependency Installation**: Use `uv pip install` or `uv sync` to install dependencies from `pyproject.toml`
- **Dependency Management**: Use `uv add <package>` to add new dependencies, which automatically updates `pyproject.toml` and `uv.lock`
- **Environment Reproduction**: Use `uv sync` to recreate the exact environment from `uv.lock` on different machines

## 3. Core Components

### 3.1. `src/todo_app/task_manager.py`

This module will contain the core logic for managing todo tasks, with persistence to a local JSON file. It will expose functions that directly map to the actions expected by the `todo-task-manager` agent: `add`, `view`, `update`, `delete`, and `mark_complete`.

-   **`Task` Data Structure**: A simple class or dataclass to represent a todo item, including `id` (integer), `title` (string), `description` (string, optional), and `status` (string, e.g., "pending", "completed"). This class will also need methods for serialization to/deserialization from JSON.
-   **JSON Storage**: Tasks will be loaded from and saved to `tasks.json`.
-   **ID Generation**: Simple sequential integer IDs, ensuring uniqueness even after loading from JSON.

**Functions:**

-   `_load_tasks() -> None`: Internal method to load tasks from `tasks.json` into `_tasks` dictionary.
-   `_save_tasks() -> None`: Internal method to save `_tasks` dictionary to `tasks.json`.
-   `add_task(title: str, description: Optional[str] = None) -> Task`: Creates and adds a new task, then saves tasks.
-   `get_task(task_id: int) -> Optional[Task]`: Retrieves a task by ID.
-   `list_tasks(status: Optional[str] = None) -> List[Task]`: Returns all tasks or tasks filtered by status.
-   `update_task(task_id: int, title: Optional[str] = None, description: Optional[str] = None, status: Optional[str] = None) -> Optional[Task]`: Updates an existing task, then saves tasks.
-   `delete_task(task_id: int) -> bool`: Deletes a task by ID, then saves tasks.
-   `mark_task_complete(task_id: int) -> Optional[Task]`: Sets a task's status to "completed", then saves tasks.

### 3.2. `src/todo_app/cli.py`

This module will handle both the command-line interface and the interactive menu interface, supporting both modes for different use cases. It will parse user commands and arguments for command-line mode and manage the interactive menu flow for user-friendly mode.

-   **Command Parsing**: Use `argparse` for command-line argument parsing.
-   **Interactive Menu**: Use inquirer for interactive menu navigation with arrow keys.
-   **User Interaction**: Displaying task lists and error messages via the UI module.

**Commands to support:**

-   `python main.py add --title "..." [--description "..."]`
-   `python main.py delete --id <id>`
-   `python main.py update --id <id> [--title "..."] [--description "..."] [--status "..."]`
-   `python main.py view [--status "all"|"pending"|"completed"]`
-   `python main.py complete --id <id>`

### 3.3. `src/todo_app/ui.py`

This module will handle the colorful, user-friendly UI components using the Rich library for formatting and styling. It will provide functions for displaying menus, task lists, input prompts, and error messages with visual appeal.

-   **Interactive Menu**: Display an interactive menu with options: "Add Task", "View Tasks", "Update Task", "Delete Task", "Mark as Complete", and "Exit".
-   **Colorful Formatting**: Use Rich library for colored text, tables, and visual elements.
-   **Input Prompts**: Provide guided input prompts with clear instructions.
-   **Task Display**: Format task lists with appropriate styling and status indicators.
-   **Error Display**: Show error messages in a visually distinct manner.

### 3.4. `src/main.py`

The main entry point that will detect if arguments are provided to determine whether to run in command-line mode or interactive mode.

## 4. Integration with `todo-task-manager` Agent

The `todo-task-manager` agent is designed to orchestrate actions. The console application will be built to directly implement the actions that the `todo-task-manager` agent expects to delegate, while also providing an interactive user-friendly mode for direct human use.

-   The `todo-task-manager` agent will receive user commands (e.g., "Add 'Review PR #123'").
-   It will then translate these commands into structured `subagent` invocations (e.g., `action='add', payload={'title': 'Review PR #123'}`).
-   My Python console application will effectively *be* the "underlying todo task skill" that the `todo-task-manager` agent interacts with. I will ensure that the command-line interface of my Python app can be invoked by the agent with the appropriate actions and payloads. This implies that the Python application will need to be executable with arguments that mimic the agent's payload structure.
-   When no command-line arguments are provided, the application will launch in interactive mode with a colorful, menu-driven UI.

**Example Agent Interaction Flow:**

1.  **User**: "Add 'Buy groceries'"
2.  **`todo-task-manager` agent**: Calls `python3 src/main.py add --title "Buy groceries"`.
3.  **My Python app**: Receives `add` action and title, calls `task_manager.add_task("Buy groceries")`.
4.  **My Python app**: Prints success/failure.

**Example Interactive Mode Flow:**

1.  **User**: Runs `python3 src/main.py` with no arguments
2.  **My Python app**: Launches interactive menu with colorful UI
3.  **User**: Navigates menu using arrow keys and selects "Add Task"
4.  **My Python app**: Prompts for title and description with guided input
5.  **My Python app**: Calls `task_manager.add_task()` and confirms success visually

## 5. Error Handling

-   Invalid task IDs will result in user-friendly error messages.
-   Input validation for title length, description length will be implemented in `task_manager.py`.
-   File I/O errors for `tasks.json` will be gracefully handled (e.g., creating an empty `tasks.json` if it doesn't exist).
-   UI-specific error messages will be formatted with Rich for visual distinction in interactive mode.
-   Both command-line and interactive modes will provide appropriate error feedback to users.

## 6. Testing

-   Unit tests for `task_manager.py` functions, including JSON load/save operations and data integrity.
-   Integration tests for `cli.py` to ensure commands are parsed and executed correctly, and that persistence works as expected across multiple command invocations.
-   UI tests for `ui.py` to verify colorful output formatting and menu display functionality.
-   End-to-end tests for both interactive and command-line modes to ensure all features work correctly.

## 7. Deliverables

-   `src/` directory with the Python application including interactive UI module.
-   `tasks.json` file for data persistence.
-   Updated `README.md` with UV virtual environment setup and usage instructions for both interactive and command-line modes.
-   Updated `CLAUDE.md` if necessary with agent-specific instructions.
-   `pyproject.toml` file with dependencies including rich and inquirer libraries.
-   `uv.lock` file with locked dependency versions.

## 8. Risks and Mitigation

-   **Risk**: Potential for data corruption in `tasks.json` due to incorrect serialization/deserialization or concurrent access (though unlikely for a single-user console app).
    -   **Mitigation**: Implement robust JSON serialization/deserialization, including error handling for malformed JSON. Ensure atomic write operations if possible.
-   **Risk**: Misinterpretation of "clean code principles" or "proper Python project structure."
    -   **Mitigation**: Adhere to PEP 8 guidelines, use clear module separation, and focus on single responsibility for classes/functions.
-   **Risk**: Ensuring the in-memory task management aligns with future persistent storage requirements without over-engineering this phase.
    -   **Mitigation**: Design the `Task` data structure and `task_manager.py` functions with an interface that can be easily adapted to a different database layer in future phases (e.g., by abstracting the storage mechanism further).
-   **Risk**: Compatibility issues with different terminal environments for the colorful UI.
    -   **Mitigation**: Use Rich library which handles cross-platform compatibility and gracefully degrades in terminals that don't support colors.
-   **Risk**: Maintaining both interactive and command-line modes without code duplication.
    -   **Mitigation**: Structure the code with clear separation of concerns, keeping business logic in `task_manager.py` and separating UI presentation logic in `ui.py`.
-   **Risk**: Dependency management complexity with UV virtual environment.
    -   **Mitigation**: Use proper UV workflow with `pyproject.toml` and `uv.lock` to ensure reproducible environments across development and deployment.

## 9. Constitution Check

-   **I. Spec-Driven Development**: Yes, the plan is derived directly from `spec.md` and updated based on user feedback.
-   **II. Iterative Evolution & AI-Native Architecture**: Yes, this phase lays the foundation and explicitly integrates with the `todo-task-manager` agent while adding user-friendly interactive features.
-   **III. Clean Code & Python Project Structure**: Yes, the plan emphasizes standard Python structure and clean code with proper separation of concerns.
-   **IV. Comprehensive Testing**: Yes, the plan includes unit, integration, and UI testing, now covering JSON persistence and interactive features.
-   **V. Documentation & Knowledge Capture**: Yes, `README.md` and `CLAUDE.md` updates are planned to document both interactive and command-line usage with UV virtual environment setup, and PHRs will be created.
-   **VI. Cloud-Native & Event-Driven Design**: The plan considers abstracting storage for future phases and maintains dual-mode operation for both human users and agent integration, with proper dependency management using UV.
