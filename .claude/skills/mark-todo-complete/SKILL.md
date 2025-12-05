# Skill: `mark-todo-complete`

*   **Purpose:** To change the completion status of an existing todo task.
*   **Description:** This skill toggles the `completed` status of a task identified by its `task_id`.
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to mark.
    *   `completed` (boolean, required): `true` to mark as complete, `false` to mark as incomplete.
*   **Returns:** A dictionary containing the `id`, `title`, and new `completed` status of the task.
*   **Usage (Conceptual):**
    ```
    skill: "mark-todo-complete" {
      task_id: 2,
      completed: true
    }
    ```