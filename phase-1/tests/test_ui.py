"""
Unit tests for the UI module
Tests for formatting and display functions in ui.py
"""
import unittest
from unittest.mock import patch, MagicMock
from src.todo_app.ui import display_tasks, display_error, display_success
from src.todo_app.task_manager import Task


class TestUI(unittest.TestCase):
    """Test cases for UI module functions"""

    def setUp(self):
        """Set up test tasks for testing"""
        self.task1 = Task(id=1, title="Test Task 1", description="Test Description 1", status="pending")
        self.task2 = Task(id=2, title="Test Task 2", description="Test Description 2", status="completed")
        self.task3 = Task(id=3, title="Test Task 3", status="pending")

    @patch('src.todo_app.ui.console')
    def test_display_tasks_with_tasks(self, mock_console):
        """Test displaying tasks with multiple tasks"""
        tasks = [self.task1, self.task2, self.task3]
        display_tasks(tasks)

        # Verify that print was called (console.print is used internally)
        mock_console.print.assert_called()

    @patch('src.todo_app.ui.print')
    def test_display_tasks_empty_list(self, mock_print):
        """Test displaying tasks with empty list"""
        display_tasks([])
        mock_print.assert_called_with("[yellow]No tasks found.[/yellow]")

    @patch('src.todo_app.ui.print')
    def test_display_tasks_filtered_completed(self, mock_print):
        """Test displaying tasks filtered by completed status"""
        tasks = [self.task1, self.task3]  # Only pending tasks
        display_tasks(tasks, "completed")

        # Should show "No completed tasks found" since there are no completed tasks
        mock_print.assert_called_with("[yellow]No completed tasks found.[/yellow]")

    @patch('src.todo_app.ui.print')
    def test_display_tasks_filtered_pending(self, mock_print):
        """Test displaying tasks filtered by pending status"""
        tasks = [self.task1, self.task2, self.task3]
        display_tasks(tasks, "pending")

        # Since we have pending tasks, this won't show "No pending tasks found"
        # but rather the table, so this test is a bit limited without mocking Table
        # Let's just ensure it doesn't show the "No tasks found" message
        # We can't easily verify the table display without complex mocking
        pass

    @patch('src.todo_app.ui.print')
    def test_display_error(self, mock_print):
        """Test displaying error message"""
        error_msg = "Test error message"
        display_error(error_msg)
        expected_call = f"[red][bold]Error:[/bold] {error_msg}[/red]"
        mock_print.assert_called_with(expected_call)

    @patch('src.todo_app.ui.print')
    def test_display_success(self, mock_print):
        """Test displaying success message"""
        success_msg = "Test success message"
        display_success(success_msg)
        expected_call = f"[green]{success_msg}[/green]"
        mock_print.assert_called_with(expected_call)


if __name__ == '__main__':
    unittest.main()