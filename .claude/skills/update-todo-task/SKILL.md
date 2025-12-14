# Skill: `update-todo-task`

*   **Purpose:** To modify the details of an existing todo task.
*   **Description:** This skill takes a `task_id` to identify the task and allows updating its `title` and/or `description`.
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to update.
    *   `title` (string, optional): The new title for the task.
    *   `description` (string, optional): The new description for the task.
*   **Returns:** A dictionary containing the `id`, `title`, and `status` of the updated task.
*   **Usage (Conceptual):**
    ```
    skill: "update-todo-task" {
      task_id: 1,
      title: "Finalize client meeting presentation",
      description: "Review slides and prepare talking points"
    }
    ```