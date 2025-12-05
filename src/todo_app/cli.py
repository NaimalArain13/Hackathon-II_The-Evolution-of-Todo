import argparse
from typing import Optional
from .task_manager import TaskManager


def add_task_command(task_manager: TaskManager, title: str, description: Optional[str] = None):
    """Handle the add task command."""
    try:
        task = task_manager.add_task(title=title, description=description)
        print(f"Task added successfully with ID: {task.id}")
        print(f"Title: {task.title}")
        if task.description:
            print(f"Description: {task.description}")
        print(f"Status: {task.status}")
    except ValueError as e:
        print(f"Error: {e}")


def delete_task_command(task_manager: TaskManager, task_id: int):
    """Handle the delete task command."""
    success = task_manager.delete_task(task_id)
    if success:
        print(f"Task {task_id} deleted successfully")
    else:
        print(f"Error: Task with ID {task_id} not found")


def update_task_command(
    task_manager: TaskManager,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    status: Optional[str] = None
):
    """Handle the update task command."""
    task = task_manager.update_task(
        task_id=task_id,
        title=title,
        description=description,
        status=status
    )
    if task:
        print(f"Task {task_id} updated successfully")
        print(f"Title: {task.title}")
        if task.description:
            print(f"Description: {task.description}")
        print(f"Status: {task.status}")
    else:
        print(f"Error: Task with ID {task_id} not found")


def view_tasks_command(task_manager: TaskManager, status: Optional[str] = None):
    """Handle the view tasks command."""
    tasks = task_manager.list_tasks(status=status)

    if not tasks:
        if status:
            print(f"No {status} tasks found")
        else:
            print("No tasks found")
        return

    # Determine the max width for ID and status to align the output
    max_id_width = max(len(str(task.id)) for task in tasks) if tasks else 2
    max_status_width = max(len(task.status) for task in tasks) if tasks else 9

    print(f"{'ID':<{max_id_width}} | {'Status':<{max_status_width}} | Title")
    print("-" * (max_id_width + max_status_width + 15))

    for task in tasks:
        print(f"{task.id:<{max_id_width}} | {task.status:<{max_status_width}} | {task.title}")


def complete_task_command(task_manager: TaskManager, task_id: int):
    """Handle the complete task command."""
    task = task_manager.mark_task_complete(task_id)
    if task:
        print(f"Task {task_id} marked as completed successfully")
    else:
        print(f"Error: Task with ID {task_id} not found")


def create_parser():
    """Create and configure the argument parser."""
    parser = argparse.ArgumentParser(description="Todo List Manager")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a new task")
    add_parser.add_argument("--title", required=True, help="Task title (1-200 characters)")
    add_parser.add_argument("--description", help="Task description (optional, max 1000 characters)")

    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a task")
    delete_parser.add_argument("--id", type=int, required=True, help="Task ID to delete")

    # Update command
    update_parser = subparsers.add_parser("update", help="Update a task")
    update_parser.add_argument("--id", type=int, required=True, help="Task ID to update")
    update_parser.add_argument("--title", help="New task title (1-200 characters)")
    update_parser.add_argument("--description", help="New task description (optional, max 1000 characters)")
    update_parser.add_argument("--status", choices=["pending", "completed"], help="New task status")

    # View command
    view_parser = subparsers.add_parser("view", help="View tasks")
    view_parser.add_argument(
        "--status",
        choices=["all", "pending", "completed"],
        default="all",
        help="Filter tasks by status (default: all)"
    )

    # Complete command
    complete_parser = subparsers.add_parser("complete", help="Mark task as complete")
    complete_parser.add_argument("--id", type=int, required=True, help="Task ID to mark as complete")

    return parser


def run_cli():
    """Run the command-line interface."""
    parser = create_parser()
    args = parser.parse_args()

    # Initialize the task manager
    task_manager = TaskManager()

    # Execute the appropriate command based on user input
    if args.command == "add":
        add_task_command(task_manager, args.title, args.description)
    elif args.command == "delete":
        delete_task_command(task_manager, args.id)
    elif args.command == "update":
        # For the status argument, we need to handle the "all" case from view command differently
        status = args.status if args.command != "view" and hasattr(args, 'status') and args.status not in ["all"] else args.status if hasattr(args, 'status') and args.status in ["pending", "completed"] else None
        update_task_command(
            task_manager,
            args.id,
            args.title,
            args.description,
            status
        )
    elif args.command == "view":
        # For view command, convert "all" to None to show all tasks
        status_filter = args.status if args.status != "all" else None
        view_tasks_command(task_manager, status_filter)
    elif args.command == "complete":
        complete_task_command(task_manager, args.id)
    else:
        parser.print_help()