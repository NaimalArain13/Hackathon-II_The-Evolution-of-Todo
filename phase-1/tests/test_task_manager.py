"""
Unit tests for the task manager module
Tests for add_task, delete_task, update_task, list_tasks, and mark_task_complete with JSON persistence checks
"""
import unittest
import json
import os
from src.todo_app.task_manager import TaskManager, Task


class TestTaskManager(unittest.TestCase):
    """Test cases for all task manager functions with JSON persistence"""

    def setUp(self):
        """Set up test environment"""
        self.test_file = 'test_tasks.json'
        self.task_manager = TaskManager(storage_file=self.test_file)

        # Ensure clean state
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def tearDown(self):
        """Clean up after tests"""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_add_task_basic(self):
        """Test adding a basic task"""
        task = self.task_manager.add_task("Test Title")
        self.assertEqual(task.title, "Test Title")
        self.assertEqual(task.status, "pending")
        self.assertIsNotNone(task.id)
        self.assertIsNone(task.description)

    def test_add_task_with_description(self):
        """Test adding a task with description"""
        task = self.task_manager.add_task("Test Title", "Test Description")
        self.assertEqual(task.title, "Test Title")
        self.assertEqual(task.description, "Test Description")
        self.assertEqual(task.status, "pending")
        self.assertIsNotNone(task.id)

    def test_add_task_persists_to_json(self):
        """Test that added task is persisted to JSON file"""
        task = self.task_manager.add_task("Test Title", "Test Description")

        # Check that the file exists and contains the task
        self.assertTrue(os.path.exists(self.test_file))

        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertIn(str(task.id), tasks_data)
            saved_task = tasks_data[str(task.id)]
            self.assertEqual(saved_task['title'], "Test Title")
            self.assertEqual(saved_task['description'], "Test Description")
            self.assertEqual(saved_task['status'], "pending")

    def test_add_task_title_validation(self):
        """Test title validation - should raise ValueError for invalid titles"""
        with self.assertRaises(ValueError):
            self.task_manager.add_task("")  # Empty title

        with self.assertRaises(ValueError):
            self.task_manager.add_task("A" * 201)  # Title too long

    def test_add_task_description_validation(self):
        """Test description validation - should raise ValueError for invalid descriptions"""
        with self.assertRaises(ValueError):
            self.task_manager.add_task("Test Title", "A" * 1001)  # Description too long

    def test_add_multiple_tasks(self):
        """Test adding multiple tasks with sequential IDs"""
        task1 = self.task_manager.add_task("Task 1")
        task2 = self.task_manager.add_task("Task 2")

        self.assertEqual(task1.id + 1, task2.id)  # IDs should be sequential

        # Verify both tasks are in the JSON file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertEqual(len(tasks_data), 2)
            self.assertIn(str(task1.id), tasks_data)
            self.assertIn(str(task2.id), tasks_data)

    def test_delete_task(self):
        """Test deleting a task and persistence"""
        task = self.task_manager.add_task("Task to Delete", "Description")
        initial_id = task.id

        # Delete the task
        result = self.task_manager.delete_task(initial_id)
        self.assertTrue(result)

        # Verify task is gone from in-memory storage
        retrieved_task = self.task_manager.get_task(initial_id)
        self.assertIsNone(retrieved_task)

        # Verify task is gone from JSON file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            self.assertNotIn(str(initial_id), data)

    def test_delete_nonexistent_task(self):
        """Test deleting a non-existent task"""
        result = self.task_manager.delete_task(999)
        self.assertFalse(result)

    def test_update_task(self):
        """Test updating a task and persistence"""
        task = self.task_manager.add_task("Original Title", "Original Description")
        task_id = task.id

        # Update the task
        updated_task = self.task_manager.update_task(
            task_id,
            "Updated Title",
            "Updated Description",
            "completed"
        )

        self.assertIsNotNone(updated_task)
        self.assertEqual(updated_task.title, "Updated Title")
        self.assertEqual(updated_task.description, "Updated Description")
        self.assertEqual(updated_task.status, "completed")

        # Verify update is reflected in JSON file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            saved_task = tasks_data[str(task_id)]
            self.assertEqual(saved_task['title'], "Updated Title")
            self.assertEqual(saved_task['description'], "Updated Description")
            self.assertEqual(saved_task['status'], "completed")

    def test_update_task_partial(self):
        """Test updating only some fields of a task"""
        task = self.task_manager.add_task("Original Title", "Original Description")
        task_id = task.id

        # Update only the title
        updated_task = self.task_manager.update_task(task_id, title="New Title")

        self.assertEqual(updated_task.title, "New Title")
        self.assertEqual(updated_task.description, "Original Description")  # Should remain unchanged
        self.assertEqual(updated_task.status, "pending")  # Should remain unchanged

    def test_update_nonexistent_task(self):
        """Test updating a non-existent task"""
        result = self.task_manager.update_task(999, "New Title")
        self.assertIsNone(result)

    def test_list_tasks(self):
        """Test listing tasks with different filters"""
        # Add tasks with different statuses - first add then update status
        task1 = self.task_manager.add_task("Pending Task")
        task2 = self.task_manager.add_task("Completed Task")
        task3 = self.task_manager.add_task("Another Pending")

        # Update task2 to completed status
        self.task_manager.update_task(task2.id, status="completed")

        # Test listing all tasks
        all_tasks = self.task_manager.list_tasks()
        self.assertEqual(len(all_tasks), 3)

        # Test filtering by pending
        pending_tasks = self.task_manager.list_tasks(status="pending")
        self.assertEqual(len(pending_tasks), 2)
        for task in pending_tasks:
            self.assertEqual(task.status, "pending")

        # Test filtering by completed
        completed_tasks = self.task_manager.list_tasks(status="completed")
        self.assertEqual(len(completed_tasks), 1)
        self.assertEqual(completed_tasks[0].status, "completed")

    def test_get_task(self):
        """Test getting a specific task"""
        original_task = self.task_manager.add_task("Test Task", "Test Description")
        retrieved_task = self.task_manager.get_task(original_task.id)

        self.assertEqual(retrieved_task.id, original_task.id)
        self.assertEqual(retrieved_task.title, original_task.title)
        self.assertEqual(retrieved_task.description, original_task.description)
        self.assertEqual(retrieved_task.status, original_task.status)

    def test_get_nonexistent_task(self):
        """Test getting a non-existent task"""
        retrieved_task = self.task_manager.get_task(999)
        self.assertIsNone(retrieved_task)

    def test_mark_task_complete(self):
        """Test marking a task as complete and persistence"""
        task = self.task_manager.add_task("Task to Complete", "Description")
        task_id = task.id

        # Mark as complete
        completed_task = self.task_manager.mark_task_complete(task_id)

        self.assertIsNotNone(completed_task)
        self.assertEqual(completed_task.status, "completed")

        # Verify update is reflected in JSON file
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            saved_task = tasks_data[str(task_id)]
            self.assertEqual(saved_task['status'], "completed")

    def test_mark_nonexistent_task_complete(self):
        """Test marking a non-existent task as complete"""
        result = self.task_manager.mark_task_complete(999)
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()