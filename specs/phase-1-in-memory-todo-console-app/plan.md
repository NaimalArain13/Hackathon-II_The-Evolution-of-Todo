## Plan for Phase I - Todo In-Memory Python Console App (JSON Storage)

## 1. Project Structure

The project will follow a standard Python project structure within the `/src` directory. Tasks will be stored in a `tasks.json` file at the root of the project.

```
./
├── src/
│   ├── __init__.py
│   ├── main.py             # Entry point for the console application
│   ├── todo_app/
│   │   ├── __init__.py
│   │   ├── task_manager.py # Implements the task management logic with JSON persistence
│   │   └── cli.py          # Handles command-line parsing and interacts with task_manager.py
├── tasks.json          # Local JSON file for storing todo tasks
```

## 2. Core Components

### 2.1. `src/todo_app/task_manager.py`

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

### 2.2. `src/todo_app/cli.py`

This module will handle the command-line interface, parsing user commands and arguments, and then calling the appropriate functions in `task_manager.py`.

-   **Command Parsing**: Use `argparse` for command-line argument parsing.
-   **User Interaction**: Displaying task lists and error messages.

**Commands to support:**

-   `python main.py add --title "..." [--description "..."]`
-   `python main.py delete --id <id>`
-   `python main.py update --id <id> [--title "..."] [--description "..."] [--status "..."]`
-   `python main.py view [--status "all"|"pending"|"completed"]`
-   `python main.py complete --id <id>`

### 2.3. `src/main.py`

The main entry point that will delegate to `cli.py` to start the command-line interface.

## 3. Integration with `todo-task-manager` Agent

The `todo-task-manager` agent is designed to orchestrate actions. The console application will be built to directly implement the actions that the `todo-task-manager` agent expects to delegate.

-   The `todo-task-manager` agent will receive user commands (e.g., "Add 'Review PR #123'").
-   It will then translate these commands into structured `subagent` invocations (e.g., `action='add', payload={'title': 'Review PR #123'}`).
-   My Python console application will effectively *be* the "underlying todo task skill" that the `todo-task-manager` agent interacts with. I will ensure that the command-line interface of my Python app can be invoked by the agent with the appropriate actions and payloads. This implies that the Python application will need to be executable with arguments that mimic the agent's payload structure.

**Example Agent Interaction Flow:**

1.  **User**: "Add 'Buy groceries'"
2.  **`todo-task-manager` agent**: Calls `python3 src/main.py add --title "Buy groceries"`.
3.  **My Python app**: Receives `add` action and title, calls `task_manager.add_task("Buy groceries")`.
4.  **My Python app**: Prints success/failure.

## 4. Error Handling

-   Invalid task IDs will result in user-friendly error messages.
-   Input validation for title length, description length will be implemented in `task_manager.py`.
-   File I/O errors for `tasks.json` will be gracefully handled (e.g., creating an empty `tasks.json` if it doesn't exist).

## 5. Testing

-   Unit tests for `task_manager.py` functions, including JSON load/save operations and data integrity.
-   Integration tests for `cli.py` to ensure commands are parsed and executed correctly, and that persistence works as expected across multiple command invocations.

## 6. Deliverables

-   `src/` directory with the Python application.
-   `tasks.json` file for data persistence.
-   Updated `README.md` with setup and usage instructions.
-   Updated `CLAUDE.md` if necessary with agent-specific instructions.

## 7. Risks and Mitigation

-   **Risk**: Potential for data corruption in `tasks.json` due to incorrect serialization/deserialization or concurrent access (though unlikely for a single-user console app).
    -   **Mitigation**: Implement robust JSON serialization/deserialization, including error handling for malformed JSON. Ensure atomic write operations if possible.
-   **Risk**: Misinterpretation of "clean code principles" or "proper Python project structure."
    -   **Mitigation**: Adhere to PEP 8 guidelines, use clear module separation, and focus on single responsibility for classes/functions.
-   **Risk**: Ensuring the in-memory task management aligns with future persistent storage requirements without over-engineering this phase.
    -   **Mitigation**: Design the `Task` data structure and `task_manager.py` functions with an interface that can be easily adapted to a different database layer in future phases (e.g., by abstracting the storage mechanism further).

## 8. Constitution Check

-   **I. Spec-Driven Development**: Yes, the plan is derived directly from `spec.md` and updated based on user feedback.
-   **II. Iterative Evolution & AI-Native Architecture**: Yes, this phase lays the foundation and explicitly integrates with the `todo-task-manager` agent.
-   **III. Clean Code & Python Project Structure**: Yes, the plan emphasizes standard Python structure and clean code.
-   **IV. Comprehensive Testing**: Yes, the plan includes unit and integration testing, now covering JSON persistence.
-   **V. Documentation & Knowledge Capture**: Yes, `README.md` and `CLAUDE.md` updates are planned, and PHRs will be created.
-   **VI. Cloud-Native & Event-Driven Design**: The plan considers abstracting storage for future phases.
