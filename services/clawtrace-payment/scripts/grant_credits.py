"""Grant credits to all existing users (one-time admin script).

Usage:
    cd services/clawtrace-payment
    source .venv/bin/activate
    python scripts/grant_credits.py --credits 500 --source admin_grant --dry-run
    python scripts/grant_credits.py --credits 500 --source admin_grant
"""

from __future__ import annotations

import argparse
import asyncio
import sys
import os

# Add parent dir to path and set cwd so .env is found
_root = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, _root)
os.chdir(_root)

from app.config import Settings
from app.database import get_pool, close_pool


async def grant_credits_to_all(
    credits: float,
    source: str,
    expiration_days: int,
    dry_run: bool,
) -> None:
    settings = Settings()
    pool = await get_pool(settings)

    # Get all users
    users = await pool.fetch("SELECT id, email, name FROM users ORDER BY created_at")
    print(f"Found {len(users)} users")

    if dry_run:
        print("\n[DRY RUN] Would grant:")
        for u in users:
            print(f"  {u['email'] or u['name']}  ({u['id']})  → +{credits} credits")
        print(f"\nTotal: {credits * len(users):,.0f} credits across {len(users)} users")
        print("Run without --dry-run to execute.")
        await close_pool()
        return

    granted = 0
    for u in users:
        await pool.execute(
            """
            INSERT INTO credit_purchases
                (user_id, credits, credits_initial, source, expires_at)
            VALUES ($1, $2, $2, $3, now() + $4::interval)
            """,
            u["id"],
            credits,
            source,
            f"{expiration_days} days",
        )
        granted += 1
        print(f"  ✓ {u['email'] or u['name']}  → +{credits} credits")

    print(f"\nDone: granted {credits:,.0f} credits to {granted} users ({credits * granted:,.0f} total)")
    await close_pool()


def main():
    parser = argparse.ArgumentParser(description="Grant credits to all existing users")
    parser.add_argument("--credits", type=float, required=True, help="Credits to grant per user")
    parser.add_argument("--source", type=str, default="admin_grant", help="Source label (default: admin_grant)")
    parser.add_argument("--expiration-days", type=int, default=365, help="Days until expiration (default: 365)")
    parser.add_argument("--dry-run", action="store_true", help="Preview without executing")
    args = parser.parse_args()

    asyncio.run(grant_credits_to_all(
        credits=args.credits,
        source=args.source,
        expiration_days=args.expiration_days,
        dry_run=args.dry_run,
    ))


if __name__ == "__main__":
    main()
