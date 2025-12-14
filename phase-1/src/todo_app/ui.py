"""
UI module for the Todo Console Application
Handles colorful UI components and interactive menus using Rich and Inquirer
"""
from rich.console import Console
from rich.table import Table
from rich.prompt import Prompt, Confirm
from rich import print
import inquirer
from typing import List, Optional
from .task_manager import Task


console = Console()


def display_menu() -> str:
    """Display the interactive menu and get user selection"""
    questions = [
        inquirer.List('action',
                     message="Todo App - Select an action",
                     choices=[
                         'Add Task',
                         'View Tasks',
                         'Update Task',
                         'Delete Task',
                         'Mark as Complete',
                         'Exit'
                     ])
    ]
    answers = inquirer.prompt(questions)
    return answers['action'] if answers else 'Exit'


def display_tasks(tasks: List[Task], status_filter: Optional[str] = None) -> None:
    """Display tasks in a colorful table format"""
    if not tasks:
        print("[yellow]No tasks found.[/yellow]")
        return

    # Filter tasks by status if specified
    if status_filter:
        tasks = [task for task in tasks if task.status == status_filter]
        if not tasks:
            print(f"[yellow]No {status_filter} tasks found.[/yellow]")
            return

    table = Table(title="Todo Tasks", show_header=True, header_style="bold magenta")
    table.add_column("ID", style="dim", width=5)
    table.add_column("Title", min_width=20)
    table.add_column("Description", min_width=30)
    table.add_column("Status", justify="center")

    for task in tasks:
        status_style = "green" if task.status == "completed" else "red"
        table.add_row(
            str(task.id),
            task.title,
            task.description or "[italic]No description[/italic]",
            f"[{status_style}]{task.status}[/]"
        )

    console.print(table)


def get_task_input() -> tuple[str, Optional[str]]:
    """Get task title and description from user input"""
    title = Prompt.ask("[bold blue]Enter task title[/bold blue]")
    description = Prompt.ask("[bold blue]Enter task description (optional)[/bold blue]", default="")
    description = description if description.strip() else None
    return title, description


def get_task_id() -> int:
    """Get task ID from user input"""
    while True:
        try:
            task_id = int(Prompt.ask("[bold blue]Enter task ID[/bold blue]"))
            return task_id
        except ValueError:
            print("[red]Please enter a valid number for task ID.[/red]")


def display_error(message: str) -> None:
    """Display error message in a visually distinct manner"""
    print(f"[red][bold]Error:[/bold] {message}[/red]")


def display_success(message: str) -> None:
    """Display success message"""
    print(f"[green]{message}[/green]")


def confirm_action(message: str) -> bool:
    """Get confirmation from user for destructive actions"""
    return Confirm.ask(f"[bold yellow]{message}[/bold yellow]")