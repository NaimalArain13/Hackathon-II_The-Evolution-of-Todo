"""
Integration tests for the CLI module
Tests for add command with JSON persistence verification
"""
import unittest
import json
import os
import sys
from io import StringIO
from unittest.mock import patch
from src.todo_app.cli import add_task_command, delete_task_command, update_task_command, view_tasks_command, complete_task_command
from src.todo_app.task_manager import TaskManager


class TestCLIIntegration(unittest.TestCase):
    """Integration tests for CLI commands with JSON persistence"""

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

    @patch('sys.stdout', new_callable=StringIO)
    def test_add_command_integration(self, mock_stdout):
        """Test add command integration with JSON persistence"""
        # Add a task via CLI command
        add_task_command(self.task_manager, "Test CLI Task", "Test CLI Description")

        # Check output
        output = mock_stdout.getvalue()
        self.assertIn("Task added successfully", output)

        # Verify task was saved to JSON
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertEqual(len(tasks_data), 1)
            task_id = list(tasks_data.keys())[0]
            saved_task = tasks_data[task_id]
            self.assertEqual(saved_task['title'], "Test CLI Task")
            self.assertEqual(saved_task['description'], "Test CLI Description")
            self.assertEqual(saved_task['status'], "pending")

    @patch('sys.stdout', new_callable=StringIO)
    def test_delete_command_integration(self, mock_stdout):
        """Test delete command integration with JSON persistence"""
        # Add a task first
        task = self.task_manager.add_task("Task to Delete", "Description")

        # Delete the task via CLI command
        delete_task_command(self.task_manager, task.id)

        # Check output
        output = mock_stdout.getvalue()
        self.assertIn("deleted successfully", output)

        # Verify task was removed from JSON
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertEqual(len(tasks_data), 0)

    @patch('sys.stdout', new_callable=StringIO)
    def test_update_command_integration(self, mock_stdout):
        """Test update command integration with JSON persistence"""
        # Add a task first
        task = self.task_manager.add_task("Original Title", "Original Description")

        # Update the task via CLI command
        update_task_command(self.task_manager, task.id, "Updated Title", "Updated Description", "completed")

        # Check output
        output = mock_stdout.getvalue()
        self.assertIn("updated successfully", output)

        # Verify task was updated in JSON
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertEqual(len(tasks_data), 1)
            updated_task = tasks_data[str(task.id)]
            self.assertEqual(updated_task['title'], "Updated Title")
            self.assertEqual(updated_task['description'], "Updated Description")
            self.assertEqual(updated_task['status'], "completed")

    @patch('sys.stdout', new_callable=StringIO)
    def test_view_command_integration(self, mock_stdout):
        """Test view command integration"""
        # Add some tasks
        task1 = self.task_manager.add_task("Task 1", "Description 1")
        task2 = self.task_manager.add_task("Task 2", "Description 2")

        # Update task2 to completed status
        self.task_manager.update_task(task2.id, status="completed")

        # View tasks via CLI command
        view_tasks_command(self.task_manager)

        # Check output contains task information
        output = mock_stdout.getvalue()
        self.assertIn("Task 1", output)
        self.assertIn("Task 2", output)

    @patch('sys.stdout', new_callable=StringIO)
    def test_complete_command_integration(self, mock_stdout):
        """Test complete command integration with JSON persistence"""
        # Add a task first
        task = self.task_manager.add_task("Task to Complete", "Description")

        # Mark as complete via CLI command
        complete_task_command(self.task_manager, task.id)

        # Check output
        output = mock_stdout.getvalue()
        self.assertIn("marked as completed", output)

        # Verify task status was updated in JSON
        with open(self.test_file, 'r') as f:
            data = json.load(f)
            # TaskManager stores tasks in a nested "tasks" object
            self.assertIn("tasks", data)
            tasks_data = data["tasks"]
            self.assertEqual(len(tasks_data), 1)
            completed_task = tasks_data[str(task.id)]
            self.assertEqual(completed_task['status'], "completed")


if __name__ == '__main__':
    unittest.main()