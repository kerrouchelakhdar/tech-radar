import time
import traceback
import sys
import os
from datetime import datetime
from pathlib import Path
from collections import deque
from io import StringIO

# Add pipeline directory to path
sys.path.append(str(Path(__file__).parent))

from main import pipeline
from utils.supabase_client import get_supabase

try:
    from rich.console import Console
    from rich.layout import Layout
    from rich.panel import Panel
    from rich.live import Live
    from rich.table import Table
    from rich.text import Text
    from rich.align import Align
    from rich import box
except ImportError:
    print("Please install rich: pip install rich")
    sys.exit(1)

SLEEP_SECONDS = 1800  # 30 minutes

console = Console()

# Log capture setup
log_buffer = deque(maxlen=20)

class LogCapture:
    def __init__(self):
        self.original_stdout = sys.stdout
        self.buffer = StringIO()

    def write(self, text):
        if text.strip():
            log_buffer.append(text.strip())
        self.original_stdout.write(text) # Keep writing to stdout for debugging if needed, or remove

    def flush(self):
        self.original_stdout.flush()

def get_db_stats():
    try:
        supabase = get_supabase()
        # Get total articles count
        # Note: count='exact', head=True is efficient for counting
        response = supabase.table('articles').select('*', count='exact', head=True).execute()
        count = response.count
        return {"total_articles": count, "status": "Connected"}
    except Exception as e:
        return {"total_articles": "N/A", "status": f"Error: {str(e)[:20]}..."}

def create_dashboard(last_run, next_run, status, stats, countdown, last_inserted=0):
    layout = Layout()
    
    # Header
    header = Panel(
        Align.center(
            Text("🚀 Tech Radar Pipeline Runner", style="bold magenta", justify="center")
        ),
        box=box.ROUNDED,
        style="cyan"
    )
    
    # Stats Table
    stats_table = Table(show_header=False, box=None, expand=True)
    stats_table.add_column("Metric", style="cyan")
    stats_table.add_column("Value", style="bold white", justify="right")
    stats_table.add_row("Total Articles", str(stats.get("total_articles", "Loading...")))
    stats_table.add_row("New (Last Run)", f"+{last_inserted}" if last_inserted > 0 else "0")
    stats_table.add_row("DB Status", stats.get("status", "Checking..."))
    stats_table.add_row("Last Run", last_run or "Never")
    
    # Status Panel
    status_text = Text()
    status_text.append("Current Status: ", style="bold")
    if "Running" in status:
        status_text.append(status, style="bold green blink")
    elif "Error" in status:
        status_text.append(status, style="bold red")
    else:
        status_text.append(status, style="yellow")
        
    status_text.append("\n\n")
    status_text.append(f"Next Run In: ", style="bold")
    status_text.append(f"{countdown}", style="bold cyan")

    # Logs Panel
    logs_text = Text("\n".join(log_buffer), style="dim white")
    logs_panel = Panel(
        logs_text,
        title="Live Logs",
        border_style="grey50",
        box=box.ROUNDED
    )

    # Combine into a grid
    grid = Table.grid(expand=True)
    grid.add_column(ratio=1)
    grid.add_column(ratio=1)
    grid.add_row(
        Panel(stats_table, title="Statistics", border_style="blue", box=box.ROUNDED),
        Panel(Align.center(status_text), title="Pipeline Status", border_style="green", box=box.ROUNDED)
    )

    layout.split(
        Layout(header, size=3),
        Layout(grid, size=10),
        Layout(logs_panel)
    )
    
    return layout

if __name__ == "__main__":
    last_run_time = None
    next_run_time = None
    current_status = "Initializing"
    db_stats = {"total_articles": "...", "status": "Connecting..."}
    last_inserted_count = 0
    
    # Redirect stdout to capture logs
    sys.stdout = LogCapture()
    
    with Live(console=console, refresh_per_second=4, screen=True) as live:
        while True:
            # 1. Run Pipeline
            current_status = "Running Pipeline..."
            live.update(create_dashboard(
                last_run_time.strftime("%H:%M:%S") if last_run_time else "Never",
                "Now",
                current_status,
                db_stats,
                "00:00",
                last_inserted_count
            ))
            
            start_time = time.time()
            try:
                # Update stats before run
                db_stats = get_db_stats()
                
                # Run the actual pipeline
                result = pipeline()
                last_inserted_count = result if isinstance(result, int) else 0
                
                # Update stats after run
                db_stats = get_db_stats()
                last_run_time = datetime.now()
                current_status = "Sleeping"
                
            except Exception as e:
                current_status = f"Error: {str(e)}"
                log_buffer.append(f"Error: {str(e)}")
                traceback.print_exc()
            
            # 2. Sleep with Countdown
            elapsed = time.time() - start_time
            sleep_duration = max(60.0, SLEEP_SECONDS - elapsed)
            next_run_timestamp = time.time() + sleep_duration
            
            while time.time() < next_run_timestamp:
                remaining = int(next_run_timestamp - time.time())
                minutes = remaining // 60
                seconds = remaining % 60
                countdown_str = f"{minutes:02d}:{seconds:02d}"
                
                live.update(create_dashboard(
                    last_run_time.strftime("%H:%M:%S") if last_run_time else "Never",
                    datetime.fromtimestamp(next_run_timestamp).strftime("%H:%M:%S"),
                    current_status,
                    db_stats,
                    countdown_str,
                    last_inserted_count
                ))
                time.sleep(0.25)

