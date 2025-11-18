import time
import traceback
from main import pipeline

SLEEP_SECONDS = 1800  # 30 minutes

if __name__ == "__main__":
    print("[runner] Starting continuous RSS pipeline (every 30 min)...")
    while True:
        start = time.time()
        try:
            pipeline()
        except SystemExit:
            raise
        except Exception:
            traceback.print_exc()
        elapsed = time.time() - start
        delay = max(60.0, SLEEP_SECONDS - elapsed)
        print(f"[runner] Next run in ~{int(delay/60)} minutes")
        time.sleep(delay)
