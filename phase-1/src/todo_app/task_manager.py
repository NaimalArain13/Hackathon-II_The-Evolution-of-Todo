from dataclasses import dataclass, asdict
from typing import Optional, List, Dict
import json
import os

@dataclass
class Task:
    """Represents a todo task with ID, title, description, and status."""
    id: int
    title: str
    description: Optional[str] = None
    status: str = "pending"  # "pending" or "completed"

    def to_dict(self) -> dict:
        """Convert task to dictionary for JSON serialization."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> 'Task':
        """Create a Task instance from a dictionary."""
        return cls(**data)


class TaskManager:
    """Manages todo tasks with JSON persistence."""

    def __init__(self, storage_file: str = "tasks.json"):
        self.storage_file = storage_file
        self._tasks: Dict[int, Task] = {}
        self._next_id = 1
        self._load_tasks()

    def _load_tasks(self) -> None:
        """Load tasks from the JSON file."""
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if 'tasks' in data and isinstance(data['tasks'], dict):
                        for task_id, task_data in data['tasks'].items():
                            task_id = int(task_id)  # Ensure task_id is int
                            self._tasks[task_id] = Task.from_dict(task_data)
                            if task_id >= self._next_id:
                                self._next_id = task_id + 1
            except (json.JSONDecodeError, KeyError, ValueError) as e:
                print(f"Error loading tasks from {self.storage_file}: {e}")
                print("Starting with empty task list.")
        else:
            # Create the file with an empty structure if it doesn't exist
            self._save_tasks()

    def _save_tasks(self) -> None:
        """Save tasks to the JSON file."""
        try:
            # Prepare data for JSON serialization
            tasks_data = {str(task_id): task.to_dict() for task_id, task in self._tasks.items()}
            data = {"tasks": tasks_data}

            with open(self.storage_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"Error saving tasks to {self.storage_file}: {e}")

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """Create and add a new task, then save tasks."""
        # Validate title length
        if not title or len(title) < 1 or len(title) > 200:
            raise ValueError("Title must be between 1 and 200 characters")

        # Validate description length if provided
        if description and len(description) > 1000:
            raise ValueError("Description must be no more than 1000 characters")

        # Create new task with unique ID
        task = Task(id=self._next_id, title=title, description=description, status="pending")
        self._tasks[self._next_id] = task
        self._next_id += 1

        # Save to file
        self._save_tasks()

        return task

    def get_task(self, task_id: int) -> Optional[Task]:
        """Retrieve a task by ID."""
        return self._tasks.get(task_id)

    def list_tasks(self, status: Optional[str] = None) -> List[Task]:
        """Return all tasks or tasks filtered by status."""
        if status is None:
            return list(self._tasks.values())
        else:
            return [task for task in self._tasks.values() if task.status == status]

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None, status: Optional[str] = None) -> Optional[Task]:
        """Update an existing task, then save tasks."""
        if task_id not in self._tasks:
            return None

        task = self._tasks[task_id]

        # Validate title length if provided
        if title is not None:
            if len(title) < 1 or len(title) > 200:
                raise ValueError("Title must be between 1 and 200 characters")
            task.title = title

        # Validate description length if provided
        if description is not None:
            if len(description) > 1000:
                raise ValueError("Description must be no more than 1000 characters")
            task.description = description

        # Validate status if provided
        if status is not None:
            if status not in ["pending", "completed"]:
                raise ValueError("Status must be 'pending' or 'completed'")
            task.status = status

        # Save to file
        self._save_tasks()

        return task

    def delete_task(self, task_id: int) -> bool:
        """Delete a task by ID, then save tasks."""
        if task_id in self._tasks:
            del self._tasks[task_id]
            self._save_tasks()
            return True
        return False

    def mark_task_complete(self, task_id: int) -> Optional[Task]:
        """Set a task's status to 'completed', then save tasks."""
        if task_id not in self._tasks:
            return None

        task = self._tasks[task_id]
        task.status = "completed"

        # Save to file
        self._save_tasks()

        return task