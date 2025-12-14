# Phase I: Todo In-Memory Console App - Subagent and Skills

This document outlines the proposed subagent and skills for the Phase I "Todo In-Memory Python Console App" to achieve the "Reusable Intelligence" bonus points. By defining these components, we lay the groundwork for a modular, agent-driven approach even in this initial console application.

## Subagent: `todo-task-manager`

*   **Purpose:** To provide a high-level interface for managing todo tasks within the in-memory console application. It orchestrates the use of individual task-specific skills.
*   **Description:** The `todo-task-manager` subagent is responsible for interpreting user commands related to todo list management and invoking the appropriate granular skills (add, view, update, delete, mark complete) to perform the requested operation. It handles the overall flow of task management.
*   **Usage (Conceptual):**
    ```
    subagent: "todo-task-manager" {
      action: "add",
      payload: {title: "Buy groceries", description: "Milk, eggs, bread"}
    }
    subagent: "todo-task-manager" {
      action: "view",
      payload: {status: "all"}
    }
    ```

## Skills for `todo-task-manager`

These skills represent the atomic operations on the todo list that the `todo-task-manager` subagent can invoke.

### Skill: `add-todo-task`

*   **Purpose:** To create and add a new todo task to the in-memory list.
*   **Description:** This skill takes a `title` (required) and an optional `description` as input. It generates a unique ID for the new task and initializes its status as pending, then adds it to the in-memory task collection.
*   **Usage (Conceptual):**
    ```
    skill: "add-todo-task" {
      title: "Prepare presentation",
      description: "Finalize slides for client meeting"
    }
    ```
*   **Parameters:**
    *   `title` (string, required): The main description of the task.
    *   `description` (string, optional): Additional details for the task.
*   **Returns:** A dictionary containing the `id`, `title`, and initial `status` of the newly created task.

### Skill: `view-todo-tasks`

*   **Purpose:** To retrieve and display tasks from the in-memory todo list.
*   **Description:** This skill can filter tasks based on their completion `status` (all, pending, completed). It returns a formatted list of tasks, including their ID, title, and current status.
*   **Usage (Conceptual):**
    ```
    skill: "view-todo-tasks" {
      status: "pending"
    }
    ```
*   **Parameters:**
    *   `status` (string, optional): Filter by task status. Accepts "all", "pending", or "completed". Defaults to "all".
*   **Returns:** An array of dictionaries, each representing a task with its `id`, `title`, and `completed` status.

### Skill: `update-todo-task`

*   **Purpose:** To modify the details of an existing todo task.
*   **Description:** This skill takes a `task_id` to identify the task and allows updating its `title` and/or `description`.
*   **Usage (Conceptual):**
    ```
    skill: "update-todo-task" {
      task_id: 1,
      title: "Finalize client meeting presentation",
      description: "Review slides and prepare talking points"
    }
    ```
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to update.
    *   `title` (string, optional): The new title for the task.
    *   `description` (string, optional): The new description for the task.
*   **Returns:** A dictionary containing the `id`, `title`, and `status` of the updated task.

### Skill: `delete-todo-task`

*   **Purpose:** To remove a task from the in-memory todo list.
*   **Description:** This skill deletes a task identified by its `task_id` from the collection.
*   **Usage (Conceptual):**
    ```
    skill: "delete-todo-task" {
      task_id: 3
    }
    ```
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to delete.
*   **Returns:** A dictionary containing the `id` and `status` ("deleted") of the removed task.

### Skill: `mark-todo-complete`

*   **Purpose:** To change the completion status of an existing todo task.
*   **Description:** This skill toggles the `completed` status of a task identified by its `task_id`.
*   **Usage (Conceptual):**
    ```
    skill: "mark-todo-complete" {
      task_id: 2,
      completed: true
    }
    ```
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to mark.
    *   `completed` (boolean, required): `true` to mark as complete, `false` to mark as incomplete.
*   **Returns:** A dictionary containing the `id`, `title`, and new `completed` status of the task.
