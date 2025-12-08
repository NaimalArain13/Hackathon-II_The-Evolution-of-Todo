# Skill: `add-todo-task`

*   **Purpose:** To create and add a new todo task to the in-memory list.
*   **Description:** This skill takes a `title` (required) and an optional `description` as input. It generates a unique ID for the new task and initializes its status as pending, then adds it to the in-memory task collection.
*   **Parameters:**
    *   `title` (string, required): The main description of the task.
    *   `description` (string, optional): Additional details for the task.
*   **Returns:** A dictionary containing the `id`, `title`, and initial `status` of the newly created task.
*   **Usage (Conceptual):**
    ```
    skill: "add-todo-task" {
      title: "Prepare presentation",
      description: "Finalize slides for client meeting"
    }
    ```