# Skill: `view-todo-tasks`

*   **Purpose:** To retrieve and display tasks from the in-memory todo list.
*   **Description:** This skill can filter tasks based on their completion `status` (all, pending, completed). It returns a formatted list of tasks, including their ID, title, and current status.
*   **Parameters:**
    *   `status` (string, optional): Filter by task status. Accepts "all", "pending", or "completed". Defaults to "all".
*   **Returns:** An array of dictionaries, each representing a task with its `id`, `title`, and `completed` status.
*   **Usage (Conceptual):**
    ```
    skill: "view-todo-tasks" {
      status: "pending"
    }
    ```