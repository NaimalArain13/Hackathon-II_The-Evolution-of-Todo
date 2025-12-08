# Skill: `delete-todo-task`

*   **Purpose:** To remove a task from the in-memory todo list.
*   **Description:** This skill deletes a task identified by its `task_id` from the collection.
*   **Parameters:**
    *   `task_id` (integer, required): The unique identifier of the task to delete.
*   **Returns:** A dictionary containing the `id` and `status` ("deleted") of the removed task.
*   **Usage (Conceptual):**
    ```
    skill: "delete-todo-task" {
      task_id: 3
    }
    ```